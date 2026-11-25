import cors from 'cors'
import express from 'express'
import './env.js'
import errorHandler from '../middleware/errorHandler.js'
import notFound from '../middleware/notFound.js'
import healthRoutes from '../routes/healthRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', healthRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
