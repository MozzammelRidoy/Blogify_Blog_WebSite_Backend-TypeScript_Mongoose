import { NextFunction, Request, Response } from 'express'

// Not Found Middleware: Handles requests for undefined API routes
const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    success: false,
    message: 'API Not Found!!',
    error: ' '
  })
}

export default notFound
