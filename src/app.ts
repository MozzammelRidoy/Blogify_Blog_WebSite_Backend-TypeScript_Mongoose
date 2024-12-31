import express, { Request, Response } from 'express'
import cors from 'cors'
import routers from './app/routers'
import notFound from './app/middleware/notFound'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import cookieParser from 'cookie-parser'

// app initialization
const app = express()

// Middlewares for request parsing and CORS setup
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  })
)

// Routes handling
app.use('/api', routers)

// Home route to check server status
const homeRoute = async (req: Request, res: Response) => {
  res.status(200).json({
    server: 'Active',
    success: true,
    stutas: 200,
    message: 'This is Home Route.'
  })
}

app.get('/', homeRoute)

// Error handling middleware
app.use(globalErrorHandler as unknown as express.ErrorRequestHandler)
app.use(notFound as unknown as express.ErrorRequestHandler)

export default app
