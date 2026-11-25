import pg from 'pg'
import { config } from '../config/env.js'

const { Pool } = pg

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message)
})

export const query = (text, params = []) => pool.query(text, params)

export const testDatabaseConnection = async () => {
  const result = await pool.query('SELECT NOW() AS current_time, current_database() AS database_name')
  return result.rows[0]
}

export const closeDatabasePool = async () => {
  await pool.end()
}
