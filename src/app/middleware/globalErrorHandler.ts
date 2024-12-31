import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { TErrorSources } from '../interface/error'
import { ZodError } from 'zod'
import handleZodValidationError from '../errors/handleZodValidationError'
import handleMongooseValidationError from '../errors/handleMongooseValidationError'
import handleMongooseCastError from '../errors/handleMongooseCastError'
import handleMongooseDuplicateError from '../errors/handleMongooseDuplicateError'
import AppError from '../errors/AppError'

// Global Error Handler: Catches and processes different types of errors for consistent response
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Initialize default error details
  let statusCode: number = 500
  let message: string = 'Something went wrong!'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!'
    }
  ]

  // Zod validation error handling
  if (err instanceof ZodError) {
    const simplifiedError = handleZodValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  }
  // Mongoose validation error handling
  else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err)

    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  }

  // Mongoose cast error handling
  else if (err?.name === 'CastError') {
    const simplifiedError = handleMongooseCastError(err)

    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  }

  // Mongoose duplicate error handling
  else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err)

    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  }

  // Custom AppError handling
  else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message
      }
    ]
  }

  // Built-in error handling
  else if (err instanceof Error) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message
      }
    ]
  }

  // Error response structure
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null
  })
}

export default globalErrorHandler