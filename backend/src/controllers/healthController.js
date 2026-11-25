import { testDatabaseConnection } from '../db/pool.js'

export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Fitness Builder API is running',
    timestamp: new Date().toISOString(),
  })
}

export const getDatabaseHealth = async (req, res, next) => {
  try {
    const dbInfo = await testDatabaseConnection()

    res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      database: dbInfo.database_name,
      timestamp: dbInfo.current_time,
    })
  } catch (error) {
    error.statusCode = 503
    const detail = error.message || 'Unable to connect to the database'
    error.message = detail.startsWith('Database connection failed')
      ? detail
      : `Database connection failed: ${detail}`
    next(error)
  }
}
