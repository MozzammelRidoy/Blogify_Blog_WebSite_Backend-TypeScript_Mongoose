import mongoose from 'mongoose'
import { TUser, UserModel } from './user.interface'
import { UserRole } from './user.constant'
import bcrypt from 'bcrypt'
import config from '../../config'

// Define the User schema
const UserSchema = new mongoose.Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      select: 0
    },
    role: {
      type: String,
      enum: UserRole,
      default: 'user'
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Check if user exists by email (with password selection)
UserSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

// Check if user exists by ID (with password selection)
UserSchema.statics.isUserExistsBy_id = async function (id: string) {
  return await User.findById(id, {}, { skipMiddleware: true }).select(
    '+password'
  )
}

// Pre-save middleware for hashing the user's password
UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  )
  next()
})

// Post-save middleware for removing the password from the document after saving
UserSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// Check if password matches using bcrypt
UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

// Check if the user is already marked as deleted
UserSchema.statics.isUserAlreadyDeleted = async function (id: string) {
  const isDeleted = await User.findById(id, {}, { skipMiddleware: true })
  return isDeleted?.isDeleted
}

// Middleware to exclude deleted users from `find` operations unless skipped
UserSchema.pre('find', async function (next) {
  const skipMiddleware = this.getOptions().skipMiddleware

  if (!skipMiddleware) {
    this.find({ isDeleted: { $ne: true } })
  }
  next()
})

// Middleware to exclude deleted users from `findOne` operations unless skipped
UserSchema.pre('findOne', async function (next) {
  const skipMiddleware = this.getOptions().skipMiddleware

  if (!skipMiddleware) {
    this.findOne({ isDeleted: { $ne: true } })
  }
  next()
})

// Middleware to exclude deleted users from aggregation operations
UserSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })

  next()
})

// Add a full-text index on name, email, and role fields
UserSchema.index({ name: 'text', email: 'text', role: 'text' })

// Create the User model based on the schema
export const User = mongoose.model<TUser, UserModel>('User', UserSchema)
