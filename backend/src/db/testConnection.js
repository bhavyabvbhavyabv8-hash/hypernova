import { testDatabaseConnection, closeDatabasePool } from './pool.js'

const run = async () => {
  try {
    const info = await testDatabaseConnection()
    console.log(`Database connection successful: ${info.database_name} at ${info.current_time}`)
  } catch (error) {
    console.error('Database connection failed:', error.message)
    process.exitCode = 1
  } finally {
    await closeDatabasePool()
  }
}

run()
