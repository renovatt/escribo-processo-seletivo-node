import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
// import { router } from './router'

dotenv.config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

const app = express()

app.use(express.json())
// app.use(router)

mongoose.connect(DATABASE_URL as string).then(() => {
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
app.listen(process.env.PORT || 5555, () =>
  console.log('server listening on port 5555'),
)
