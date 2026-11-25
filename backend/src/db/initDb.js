import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { database } from './pool.js'

const directory = dirname(fileURLToPath(import.meta.url))

async function initializeDatabase() {
  const schema = await readFile(resolve(directory, 'schema.sql'), 'utf8')
  const seed = await readFile(resolve(directory, 'seed.sql'), 'utf8')

  await database.transaction(async (client) => {
    await client.query(schema)
    await client.query(seed)
  })

  console.log('FLOCCI FIT database initialized and exercise catalog seeded.')
}

initializeDatabase()
  .catch((error) => {
    console.error('FLOCCI FIT database initialization failed:', error.message)
    process.exitCode = 1
  })
  .finally(() => database.close())
