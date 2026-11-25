function errorHandler(error, _req, res, _next) {
  const status = Number(error.status || error.statusCode) || 500

  if (status >= 500) {
    console.error(error)
  }

  res.status(status).json({
    status: 'error',
    message: status >= 500 ? 'Internal server error' : error.message,
  })
}

export default errorHandler
