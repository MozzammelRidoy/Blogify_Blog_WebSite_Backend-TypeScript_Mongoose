import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BlogServices } from './blog.service'

// =================== Blog Controllers ===================

// Create a new blog
const createBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlogIntoDB(req.body, req.user)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog created successfully',
    data: result
  })
})

// Fetch all blogs
const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs fetched successfully',
    data: result
  })
})

// Update a single blog
const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await BlogServices.updateBlogIntoDB(id, req.body, req.user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: result
  })
})

// Delete a single blog
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await BlogServices.deleteBlogFromDB(id, req.user)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: result
  })
})

// Export Blog Controllers
export const BlogControllers = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
}
