import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import healthRoutes from './routes/healthRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', healthRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
