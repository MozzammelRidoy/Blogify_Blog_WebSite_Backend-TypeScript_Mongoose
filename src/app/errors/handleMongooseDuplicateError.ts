import { TErrorSources, TGenericErrorResponse } from '../interface/error'

// Handles Mongoose duplicate key error and formats response
const handleMongooseDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/dup key: \{\s*([^:]+):\s*"([^"]+)"\s*\}/)
  const fieldName = match?.[1]?.trim() || 'unknown_field'
  const fieldValue = match?.[2]?.trim() || 'unknown_value'

  const errorSources: TErrorSources = [
    {
      path: fieldName || '',
      message: fieldValue
        ? `${fieldValue} is Already exists!`
        : 'Duplicate Error'
    }
  ]
  const statusCode = 400

  return {
    statusCode,
    message: 'Duplicate Error',
    errorSources
  }
}

export default handleMongooseDuplicateError
