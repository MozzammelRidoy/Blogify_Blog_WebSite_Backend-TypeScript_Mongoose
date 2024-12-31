import { Response } from 'express'

// Type definition for the structure of the response data
type TSendResponse<T> = {
  statusCode: number
  success: boolean
  message?: string
  data: T
}

// Utility function to send standardized JSON responses in Express
const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    status: data?.statusCode,
    data: data.data
  })
}

export default sendResponse
