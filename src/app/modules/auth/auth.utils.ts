import jwt from 'jsonwebtoken'
import { TRole } from '../user/user.interface'

// =================== Token Creation Utility ===================

// Generates a JWT token with the given payload, secret, and expiration time
export const createToken = (
  jwtPayload: { userId: string; role: TRole },
  jwtSecret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, jwtSecret, { expiresIn })
}
