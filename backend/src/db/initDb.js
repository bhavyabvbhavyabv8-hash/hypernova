import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool, testDatabaseConnection, closeDatabasePool } from './pool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schemaPath = path.join(__dirname, 'schema.sql')

export const initializeDatabase = async () => {
  const schemaSql = await fs.readFile(schemaPath, 'utf8')

  await pool.query('BEGIN')
  try {
    await pool.query(schemaSql)
    await pool.query('COMMIT')
  } catch (error) {
    await pool.query('ROLLBACK')
    throw error
  }

  const connectionInfo = await testDatabaseConnection()
  return connectionInfo
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)

if (isDirectRun) {
  initializeDatabase()
    .then((info) => {
      console.log(`Database initialized successfully: ${info.database_name} at ${info.current_time}`)
    })
    .catch((error) => {
      console.error('Database initialization failed:', error.message)
      process.exitCode = 1
    })
    .finally(async () => {
      await closeDatabasePool()
    })
}
