import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AdminServices } from './admin.service'

// Controller to fetch all users
const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllUsersFromDB(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully',
    data: result || 'not found!'
  })
})

// Controller to fetch a single user
const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await AdminServices.getSingleUserFromDB(userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result || 'not found!'
  })
})

// Controller to block a user
const userBlocked = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await AdminServices.userBlockedIntoDB(userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User blocked successfully',
    data: result
  })
})

// Controller to delete a user
const userDeleted = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const result = await AdminServices.userDeletedIntoDB(userId, next)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result
  })
})

// =================== Blog Related Controllers ===================

// Controller to fetch a single blog
const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.getSingleBlogFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog fetched successfully',
    data: result || 'not found'
  })
})

// Controller to private a single blog
const privateTheBlog = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.privateTheBlogIntoDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result?.message ? result.message : 'Blog Privated successfully',
    data: result?.message || result
  })
})

// Controller to delete a blog post
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.deleteBlogPostIntoDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result?.message ? result.message : 'Blog deleted successfully',
    data: result?.message || result
  })
})

// Exporting all admin controllers
export const AdminControllers = {
  getAllUsers,
  getSingleUser,
  userBlocked,
  userDeleted,
  getSingleBlog,
  privateTheBlog,
  deleteBlog
}
