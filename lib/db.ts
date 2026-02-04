import sql from 'mssql'

const config: sql.config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || '',
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE || 'UAT_Cache',
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE === 'true',
  },
  connectionTimeout: 60000,
  requestTimeout: 60000,
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null
let connecting: Promise<sql.ConnectionPool> | null = null

export async function getConnection() {
  if (pool && pool.connected) {
    return pool
  }

  if (connecting) {
    return connecting
  }

  if (pool && !pool.connected) {
    try {
      await pool.close()
    } catch (e) {
      // Ignore close errors
    }
    pool = null
  }

  connecting = sql.connect(config)
  
  try {
    pool = await connecting
    connecting = null
    return pool
  } catch (error) {
    connecting = null
    pool = null
    throw error
  }
}

export async function query(queryString: string) {
  try {
    const pool = await getConnection()
    const result = await pool.request().query(queryString)
    return result.recordset
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}
