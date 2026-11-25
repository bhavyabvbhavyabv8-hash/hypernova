function getHealth(_req, res) {
  res.json({
    status: 'ok',
    message: 'FLOCCI FIT backend is running',
  })
}

export default getHealth
