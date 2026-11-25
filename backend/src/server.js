import app from './config/app.js'
import { config } from './config/env.js'

app.listen(config.port, () => {
  console.log(`FLOCCI FIT API listening on port ${config.port}`)
})
