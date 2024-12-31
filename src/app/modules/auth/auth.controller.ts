import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'

// =================== User Registration Controller ===================

// Controller to handle user registration
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserIntoDB(req.body)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result
  })
})

// =================== User Login Controller ===================

// Controller to handle user login
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { accessToken, refreshToken } = result

  // Setting the refresh token as a secure HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production'
  })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: { token: accessToken }
  })
})

// =================== Refresh Token Controller ===================

// Generates a new access token using the refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)
  const { accessToken } = result

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access Token Regenerate',
    data: { token: accessToken }
  })
})

// Exporting the authentication controllers
export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken
}
