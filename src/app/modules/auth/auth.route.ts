import express from 'express'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidationZodSchema } from './auth.validationZodSchema'

const router = express.Router()

// =================== User Registration Route ===================

// Route to handle user registration with validation
router.post(
  '/register',
  validateRequest(AuthValidationZodSchema.registerUserValidationZodSchema),
  AuthControllers.registerUser
)

// =================== User Login Route ===================

// Route to handle user login with validation
router.post(
  '/login',
  validateRequest(AuthValidationZodSchema.loginUserValidationZodSchema),
  AuthControllers.loginUser
)

// =================== Refresh Token Route ===================

// Route to generate a new refresh token with validation
router.post(
  '/refresh-token',
  validateRequest(AuthValidationZodSchema.refreshTokenValidationZodSchema),
  AuthControllers.refreshToken
)
export const AuthRoutes = router
