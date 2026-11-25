import app from './config/app.js'
import { port } from './config/env.js'

app.listen(port, () => {
  console.log(`Hyper Nova API listening on port ${port}`)
})
