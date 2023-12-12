import express from 'express'
// import { router } from './router'

const app = express()

app.use(express.json())
// app.use(router)
app.listen(process.env.PORT || 5555, () =>
  console.log('server listening on port 5555'),
)
