import { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { createToken } from './auth.utils'
import jwt from 'jsonwebtoken'

// =================== User Registration Service ===================

// Handles user registration by adding the user to the database
const registerUserIntoDB = async (payload: TUser) => {
  // Check if the user already exists
  if (await User.isUserExistsByEmail(payload.email)) {
    throw new AppError(400, 'This user is already exists!')
  }

  // Successfully register the user
  const result = await User.create(payload)
  return result
}

// =================== User Login Service ===================

// Handles user login by validating credentials and generating tokens
const loginUser = async (payload: TLoginUser) => {
  // Check if the user exists in the database
  const user = await User.isUserExistsByEmail(payload?.email)
  if (!user) {
    throw new AppError(403, 'Invalid credentials!')
  }

  // Check if the user is deleted
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(404, 'User Not Found!')
  }

  // Check if the user is blocked
  const isBlocked = user?.isBlocked
  if (isBlocked) {
    throw new AppError(400, 'User is Blocked!')
  }

  // Validate the password
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password
  )
  if (!isPasswordMatched) {
    throw new AppError(403, 'Password do not matched!')
  }

  // Create JWT payload
  const jwtPayload = {
    userId: user._id as string,
    role: user.role
  }

  // Generate access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expiry as string
  )

  // Generate refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expiry as string
  )

  return {
    accessToken,
    refreshToken
  }
}

// =================== Refresh Token Service ===================

// Validates the refresh token and generates a new access token
const refreshToken = async (token: string) => {
  // if the token is sent from the client.
  if (!token) {
    throw new AppError(401, 'You are not authorized.')
  }

  // check if the token is valid.
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token_secret as string
  ) as JwtPayload

  const { userId } = decoded

  // Check if the user exists in the database
  const user = await User.isUserExistsBy_id(userId)
  if (!user) {
    throw new AppError(403, 'Invalid credentials!')
  }

  // Check if the user is deleted
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(404, 'User Not Found!')
  }

  // Check if the user is blocked
  const isBlocked = user?.isBlocked
  if (isBlocked) {
    throw new AppError(400, 'User is Blocked!')
  }

  // Create JWT payload
  const jwtPayload = {
    userId: user._id as string,
    role: user.role
  }

  // Generate access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expiry as string
  )

  return {
    accessToken
  }
}

//export Auth Services.
export const AuthServices = {
  registerUserIntoDB,
  loginUser,
  refreshToken
}
