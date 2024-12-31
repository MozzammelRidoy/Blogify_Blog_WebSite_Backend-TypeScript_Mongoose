import { Model } from 'mongoose'

// Define a type for user roles. Users can either be 'admin' or 'user'.
export type TRole = 'admin' | 'user'

// Define the structure of the User object
export interface TUser {
  _id?: string
  name: string
  email: string
  password: string
  role: TRole
  isBlocked: boolean
  isDeleted: boolean
}

// Define custom methods for the Mongoose User model
export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>
  isUserExistsBy_id(id: string): Promise<TUser>
  isUserAlreadyDeleted(id: string): Promise<boolean>
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>
}
