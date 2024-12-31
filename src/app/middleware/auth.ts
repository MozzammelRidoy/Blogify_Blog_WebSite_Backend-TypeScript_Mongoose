import config from '../config'
import AppError from '../errors/AppError'
import { TRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'
import catchAsync from '../utils/catchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'

// Authorization Middleware: Checks if the user is authorized and has the required role(s)
export const auth = (...requeredRole: TRole[]) => {
  return catchAsync(async (req, res, next) => {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(' ')[1]

    // Check if token exists
    if (!token) {
      throw new AppError(401, 'You are not authorized!')
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string
    ) as JwtPayload

    const { userId, role } = decoded

    // Check if user exists in the database
    const user = await User.isUserExistsBy_id(userId)
    if (!user) {
      throw new AppError(401, 'Invalid credentials')
    }

    // Check if the user is deleted
    const isDeleted = user?.isDeleted
    if (isDeleted) {
      throw new AppError(404, 'User not found!')
    }

    // Check if the user is blocked
    const isBlocked = user?.isBlocked
    if (isBlocked) {
      throw new AppError(400, 'User is blocked!')
    }

    // Check if the user has the required role
    if (user.role !== role) {
      throw new AppError(403, 'You are not authorized!')
    }

    // Check if the user role matches any of the required roles
    if (requeredRole && !requeredRole.includes(role)) {
      throw new AppError(401, 'You are not authorized!')
    }

    // Attach the decoded user data to the request object
    req.user = decoded as JwtPayload

    next()
  })
}
