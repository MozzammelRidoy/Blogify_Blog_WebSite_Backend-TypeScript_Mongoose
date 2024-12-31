import { JwtPayload } from 'jsonwebtoken'
import { TBlog } from './blog.interface'
import { Blog } from './blog.model'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { blogSearchableFileds } from './blog.constant'

// Create a new blog in the database
const createBlogIntoDB = async (payload: TBlog, user: JwtPayload) => {
  payload.author = user.userId
  const result = await Blog.create(payload)
  return result
}

// Fetch all blogs with optional search, filter, and sort
const getAllBlogsFromDB = async (qurery: Record<string, unknown>) => {
  // Initialize the query builder with the Blog model
  const blogQuery = new QueryBuilder(
    Blog.find().populate('author', 'name'),
    qurery
  )
    .search(blogSearchableFileds)
    .filter('author')
    .sort()
  const result = await blogQuery.modelQuery
  return result
}

// Update a blog, ensuring the user is the owner and the blog is not private
const updateBlogIntoDB = async (
  id: string,
  payload: TBlog,
  user: JwtPayload
) => {
  // Check if the current user is the author of the blog
  const blogOwner = await Blog.findOne(
    { _id: id, author: user.userId },
    {},
    { skipMiddleware: true }
  )
  if (!blogOwner) {
    throw new AppError(404, 'Blog not found')
  }

  // Check if the blog is private
  const isPrivate = await Blog.isBlogIsPrivate(id, user.userId)
  if (!isPrivate) {
    throw new AppError(400, 'This blog is private! You can not modify it.')
  }
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true })
  return result
}

// Delete a blog, ensuring the user is the owner
const deleteBlogFromDB = async (id: string, user: JwtPayload) => {
  // Check if the current user is the author of the blog
  const blogOwner = await Blog.findOne(
    { _id: id, author: user.userId },
    {},
    { skipMiddleware: true }
  )
  if (!blogOwner) {
    throw new AppError(404, 'Blog not found')
  }

  // Delete the blog from the database
  await Blog.findByIdAndDelete(id)
}

// Export the Blog services
export const BlogServices = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB
}
