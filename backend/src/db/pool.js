import pg from 'pg'
import { config } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

const { Pool } = pg
const pool = new Pool(config.databaseUrl ? { connectionString: config.databaseUrl } : {})

function normalizeDatabaseError(error) {
  if (error instanceof HttpError) return error
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === '3D000') {
    return new HttpError(503, 'Database unavailable. Check DATABASE_URL and PostgreSQL status.')
  }
  return error
}

export function createDatabase(clientPool, configured = true) {
  function assertConfigured() {
    if (!configured) {
      throw new HttpError(503, 'Database is not configured. Set DATABASE_URL in the root .env file.')
    }
  }

  return {
    async query(text, values = []) {
      assertConfigured()
      try {
        return await clientPool.query(text, values)
      } catch (error) {
        throw normalizeDatabaseError(error)
      }
    },
    async transaction(callback) {
      assertConfigured()
      let client
      try {
        client = await clientPool.connect()
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
      } catch (error) {
        if (client) {
          try {
            await client.query('ROLLBACK')
          } catch (rollbackError) {
            error.rollbackError = rollbackError
          }
        }
        throw normalizeDatabaseError(error)
      } finally {
        client?.release()
      }
    },
    close() {
      return clientPool.end()
    },
  }
}

export const database = createDatabase(pool, Boolean(config.databaseUrl))
