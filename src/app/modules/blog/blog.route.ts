import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { BlogValidation } from './blog.validationZodSchema'
import { BlogControllers } from './blog.controller'
import { auth } from '../../middleware/auth'

const router = express.Router()

// Route to fetch all blogs
router.get('/', BlogControllers.getAllBlogs)

// Route to create a new blog
router.post(
  '/',
  auth('user'),
  validateRequest(BlogValidation.createBlogValidationZodSchema),
  BlogControllers.createBlog
)

// Route to update an existing blog
router.patch(
  '/:id',
  auth('user'),
  validateRequest(BlogValidation.updateBlogValidationZodSchema),
  BlogControllers.updateBlog
)

// Route to delete a blog
router.delete('/:id', auth('user'), BlogControllers.deleteBlog)

export const BlogRoutes = router
