import { Server } from 'http'
import mongoose from 'mongoose'
import config from './app/config'
import app from './app'

let server: Server

// Main function to initialize the app and connect to the database
async function main() {
  try {
    // Connecting to the database
    await mongoose.connect(config.database_url as string)

    // Starting the server
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (err) {
    console.log('Error From Server', err)
  }
}

main()

// Handling unhandled promise rejections
process.on('unhandledRejection', () => {
  console.log('😡 Unhandle Rejection is Detected. Shutting Down....')

  // Closing the server gracefully in case of unhandled rejection
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// Handling uncaught exceptions
process.on('uncaughtException', () => {
  console.log('😡 Uncaught Exception is Detected. Shutting Down....')
  process.exit(1)
})
