export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (configNodeEnv() !== 'test') {
    console.error(err)
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(configNodeEnv() === 'development' && { stack: err.stack }),
  })
}

function configNodeEnv() {
  return process.env.NODE_ENV || 'development'
}
