import { z } from 'zod'

// Define the schema for creating a user
const createUserValidationZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    email: z.coerce
      .string({
        required_error: 'Email is required'
      })
      .email(),
    password: z.string({
      required_error: 'Password is required'
    })
  })
})

export const UserValidationZodSchema = {
  createUserValidationZodSchema
}
