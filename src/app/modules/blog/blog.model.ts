import mongoose, { Schema, Types } from 'mongoose'
import { BlogModel, TBlog } from './blog.interface'

// Blog Schema definition with validation rules and references
const BlogSchema = new mongoose.Schema<TBlog, BlogModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, 'Author Details is required'],
      ref: 'User'
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Static method to check if a blog exists by its ID
BlogSchema.statics.isBlogExistsFindById = async function (id: string) {
  return await this.findById(id, {}, { skipMiddleware: true })
}

// Static method to check if a blog is private (not published) for a specific author
BlogSchema.statics.isBlogIsPrivate = async function (
  id: string,
  author: Types.ObjectId
) {
  const isPrivate = await this.findOne(
    { _id: id, author },
    {},
    { skipmiddleware: true }
  )

  return isPrivate?.isPublished
}

// Pre-hook middleware for 'find' operation to ensure only published blogs are returned
BlogSchema.pre('find', async function (next) {
  const skipMiddleware = this.getOptions().skipMiddleware

  if (!skipMiddleware) {
    this.find({ isPublished: { $ne: false } })
  }

  next()
})

// Pre-hook middleware for 'findOne' operation to ensure only published blogs are returned
BlogSchema.pre('findOne', async function (next) {
  const skipMiddleware = this.getOptions().skipMiddleware

  if (!skipMiddleware) {
    this.findOne({ isPublished: { $ne: false } })
  }
  next()
})

// Pre-hook middleware for aggregation to ensure only published blogs are processed
BlogSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isPublished: { $ne: false } } })

  next()
})

// Full-text index for 'title' and 'content' fields to support text search
BlogSchema.index({ title: 'text', content: 'text' })

// Model creation using the Blog schema
export const Blog = mongoose.model<TBlog, BlogModel>('Blog', BlogSchema)
