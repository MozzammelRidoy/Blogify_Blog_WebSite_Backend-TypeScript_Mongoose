import { AnyZodObject } from 'zod'
import catchAsync from '../utils/catchAsync'

// Request Validation Middleware: Validates the request body against a provided Zod schema
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies
    })

    return next()
  })
}

export default validateRequest
