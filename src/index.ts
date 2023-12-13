import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { router } from './routes'
import { errorMiddleware } from './errors/errorMiddleware'

dotenv.config()

const PORT = process.env.PORT ?? ''
const DATABASE_URL = process.env.DATABASE_URL ?? ''

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)
app.use(errorMiddleware)

mongoose.connect(DATABASE_URL).then(() => {
  console.log('Connection to MongoDB successfully established!')
  app.listen(
    {
      port: PORT,
      host: '0.0.0.0',
    },
    () => {
      console.log(`HTTP server running on http://localhost: ${PORT} 🚀`)
    },
  )
})
