import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import app from '../src/config/app.js'

let server
let baseUrl

before(async () => {
  server = app.listen(0, '127.0.0.1')
  await new Promise((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })

  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  baseUrl = `http://127.0.0.1:${address.port}`
})

after(async () => {
  if (!server) return

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
})

test('GET /api/health reports that the backend is running', async () => {
  const response = await fetch(`${baseUrl}/api/health`)

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    status: 'ok',
    message: 'Hyper Nova backend is running',
  })
})

test('unknown routes return 404 without echoing query-string secrets', async () => {
  const response = await fetch(`${baseUrl}/api/missing?access_token=do-not-echo`)
  const body = await response.json()

  assert.equal(response.status, 404)
  assert.equal(body.status, 'error')
  assert.equal(body.message, 'Route not found: GET /api/missing')
  assert.equal(body.message.includes('do-not-echo'), false)
})
