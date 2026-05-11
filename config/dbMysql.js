import mysql from 'mysql2/promise'

let pool = null

export default async function createDB() {
  const host = process.env.MYSQL_HOST ?? '127.0.0.1'
  const user = process.env.MYSQL_USER ?? 'root'
  const password = process.env.MYSQL_PASSWORD ?? ''
  const database = process.env.MYSQL_DATABASE ?? 'DatabaseMovies'

  try {
    // Connect without database to ensure it exists and create table if necessary
    const adminPool = mysql.createPool({
      host,
      user,
      password,
      waitForConnections: true,
      connectionLimit: 2
    })

    const adminConn = await adminPool.getConnection()

    try {
      await adminConn.query('CREATE DATABASE IF NOT EXISTS `'+database+'`')
      await adminConn.query('USE `'+database+'`')

      // Create movies table if not exists
      const createTableSQL = `CREATE TABLE IF NOT EXISTS \`movies\` (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year INT NOT NULL,
        director VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        poster TEXT NOT NULL,
        genre JSON NOT NULL,
        rate INT DEFAULT 5,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;`

      await adminConn.query(createTableSQL)
    } finally {
      adminConn.release()
      await adminPool.end()
    }

    // Now create a pool that uses the database
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      decimalNumbers: true
    })

    // test connection
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()

    console.log(`MySQL connected: ${host} (database: ${database})`)
  } catch (error) {
    console.warn(`Error connecting to MySQL: ${error.message}`)
    console.warn('Continuing without MySQL connection.')
    pool = null
  }

  return pool
}

export function getPool() {
  if (!pool) throw new Error('MySQL pool is not initialized. Call createDB() first.')
  return pool
}
