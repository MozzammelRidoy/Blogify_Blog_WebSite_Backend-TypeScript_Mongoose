import express from 'express'
import { AdminControllers } from './admin.controller'
import { auth } from '../../middleware/auth'

const router = express.Router()

// =================== User Related API Routes ===================

// Route to get all users (requires admin authentication)
router.get('/users', auth('admin'), AdminControllers.getAllUsers)

// Route to get a single user by ID (requires admin authentication)
router.get('/users/:userId', auth('admin'), AdminControllers.getSingleUser)

// Route to block a user (requires admin authentication)
router.patch(
  '/users/:userId/block',
  auth('admin'),
  AdminControllers.userBlocked
)

// Route to delete a user (requires admin authentication)
router.patch(
  '/users/:userId/delete',
  auth('admin'),
  AdminControllers.userDeleted
)

// =================== Blog Related API Routes ===================

// Route to get a single blog post by ID (requires admin authentication)
router.get('/blogs/:id', auth('admin'), AdminControllers.getSingleBlog)

// Route to make a blog post private (requires admin authentication)
router.patch(
  '/blogs/:id/private',
  auth('admin'),
  AdminControllers.privateTheBlog
)

// Route to delete a blog post (requires admin authentication)
router.delete('/blogs/:id', auth('admin'), AdminControllers.deleteBlog)

// Exporting all admin routes
export const AdminRoutes = router
