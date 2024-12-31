import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { Blog } from '../blog/blog.model'
import { userSearchableFields } from '../user/user.constant'
import { User } from '../user/user.model'
import { NextFunction } from 'express'

// Service to fetch all users with applied query filters
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter('email')
    .sort()
  const result = await userQuery.modelQuery
  return result
}

// Service to fetch a single user by ID
const getSingleUserFromDB = async (userId: string) => {
  if (await User.isUserAlreadyDeleted(userId)) {
    return 'This user is already deleted!'
  }

  const result = await User.findById(userId)
  return result
}

// Service to block a user
const userBlockedIntoDB = async (id: string) => {
  if (await User.isUserAlreadyDeleted(id)) {
    throw new AppError(400, 'This user alredy deleted! You Can not modifed!')
  }
  await User.findByIdAndUpdate(id, { isBlocked: true })
}

// Service to delete a user and their blog posts
const userDeletedIntoDB = async (id: string, next: NextFunction) => {
  const user = await User.isUserExistsBy_id(id)

  if (!user) {
    throw new AppError(404, 'This user is not found!')
  }
  if (user.isDeleted) {
    throw new AppError(
      400,
      'This user is already deleted! Modifications are not allowed.'
    )
  }
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // Deactivating all blog posts by this user
    await Blog.updateMany({ author: id }, { isPublished: false }, { session })

    // Mark the user as deleted
    await User.findByIdAndUpdate(id, { isDeleted: true }, { session })

    await session.commitTransaction()
    await session.endSession()
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    next(err)
  } finally {
    await session.endSession()
  }
}

// =================== Blog Related Services ===================

// Service to fetch a single blog by ID
const getSingleBlogFromDB = async (id: string) => {
  const result = await Blog.findById(id, {}, { skipMiddleware: true }).populate(
    'author'
  )
  return result
}

// Service to private a blog post (make it unpublished)
const privateTheBlogIntoDB = async (id: string) => {
  const blog = await Blog.isBlogExistsFindById(id)
  if (!blog) {
    return { message: 'Blog not found' }
  }
  await Blog.findByIdAndUpdate(id, { isPublished: false })
}

// Service to delete a blog post
const deleteBlogPostIntoDB = async (id: string) => {
  const blog = await Blog.isBlogExistsFindById(id)
  if (!blog) {
    return { message: 'Blog not found' }
  }
  await Blog.findByIdAndDelete(id)
}

// Exporting all admin services
export const AdminServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  userBlockedIntoDB,
  userDeletedIntoDB,
  getSingleBlogFromDB,
  privateTheBlogIntoDB,
  deleteBlogPostIntoDB
}
