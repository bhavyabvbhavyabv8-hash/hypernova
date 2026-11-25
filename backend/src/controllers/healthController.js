function getHealth(_req, res) {
  res.json({
    status: 'ok',
    message: 'Hyper Nova backend is running',
  })
}

export default getHealth
