import { z } from 'zod'

// Validation schema for creating a new blog
const createBlogValidationZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Titile is required'
      })
      .max(200, { message: 'Title must be 200 or fewer characters long' }),
    content: z.string({
      required_error: 'Content is required'
    })
  })
})

// Validation schema for updating an existing blog
const updateBlogValidationZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Titile is required'
      })
      .max(200, { message: 'Title must be 200 or fewer characters long' })
      .optional(),
    content: z
      .string({
        required_error: 'Content is required'
      })
      .optional()
  })
})

// Exporting the validation schemas to be used in controllers
export const BlogValidation = {
  createBlogValidationZodSchema,
  updateBlogValidationZodSchema
}
