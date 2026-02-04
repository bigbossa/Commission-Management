import { Pool } from 'pg'

// PostgreSQL Configuration
const pgConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE || 'commission_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
}

let pgPool: Pool | null = null

// Function to create database if not exists
export async function ensureDatabaseExists() {
  // Connect to postgres database first to create target database
  const adminPool = new Pool({
    host: pgConfig.host,
    port: pgConfig.port,
    database: 'postgres', // Connect to default postgres database
    user: pgConfig.user,
    password: pgConfig.password,
  })

  try {
    // Check if database exists
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [pgConfig.database]
    )

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      console.log(`Creating database ${pgConfig.database}...`)
      await adminPool.query(`CREATE DATABASE ${pgConfig.database}`)
      console.log(`Database ${pgConfig.database} created successfully`)
    } else {
      console.log(`Database ${pgConfig.database} already exists`)
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error)
    throw error
  } finally {
    await adminPool.end()
  }
}

export async function getPgPool() {
  if (!pgPool) {
    // Ensure database exists before creating pool
    await ensureDatabaseExists()
    pgPool = new Pool(pgConfig)
  }
  return pgPool
}

export async function createTableFromSchema(tableName: string, columns: any[]) {
  const pool = await getPgPool()
  
  // Map SQL Server types to PostgreSQL types
  const typeMapping: { [key: string]: string } = {
    'int': 'INTEGER',
    'bigint': 'BIGINT',
    'smallint': 'SMALLINT',
    'tinyint': 'SMALLINT',
    'decimal': 'DECIMAL',
    'numeric': 'NUMERIC',
    'money': 'MONEY',
    'float': 'DOUBLE PRECISION',
    'real': 'REAL',
    'datetime': 'TIMESTAMP',
    'datetime2': 'TIMESTAMP',
    'date': 'DATE',
    'time': 'TIME',
    'varchar': 'VARCHAR',
    'nvarchar': 'VARCHAR',
    'char': 'CHAR',
    'nchar': 'CHAR',
    'text': 'TEXT',
    'ntext': 'TEXT',
    'bit': 'BOOLEAN',
    'uniqueidentifier': 'UUID',
  }

  const columnDefs = columns.map(col => {
    const pgType = typeMapping[col.type?.toLowerCase()] || 'TEXT'
    const nullable = col.nullable ? '' : 'NOT NULL'
    return `"${col.name}" ${pgType} ${nullable}`
  }).join(', ')

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id SERIAL PRIMARY KEY,
      ${columnDefs},
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log(`Table ${tableName} created successfully`)
    return { success: true }
  } catch (error) {
    console.error('Error creating table:', error)
    throw error
  }
}

export async function insertData(tableName: string, data: any[]) {
  if (!data || data.length === 0) return { success: true, count: 0 }

  const pool = await getPgPool()
  const columns = Object.keys(data[0])
  const columnNames = columns.map(c => `"${c}"`).join(', ')
  
  let insertedCount = 0

  try {
    for (const row of data) {
      const values = columns.map(col => row[col])
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
      
      const insertQuery = `
        INSERT INTO "${tableName}" (${columnNames})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING
      `

      await pool.query(insertQuery, values)
      insertedCount++
    }

    return { success: true, count: insertedCount }
  } catch (error) {
    console.error('Error inserting data:', error)
    throw error
  }
}

export async function clearTable(tableName: string) {
  const pool = await getPgPool()
  try {
    await pool.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY`)
    return { success: true }
  } catch (error) {
    console.error('Error clearing table:', error)
    throw error
  }
}
