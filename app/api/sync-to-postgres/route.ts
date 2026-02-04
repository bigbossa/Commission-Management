import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { createTableFromSchema, insertData, clearTable } from '@/lib/postgres'

export async function POST() {
  try {
    // 1. ดึงข้อมูลจาก SQL Server
    console.log('Fetching data from SQL Server...')
    const data = await query('SELECT * FROM SALESCOMMISSION_Cache')
    
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data found in SQL Server' 
      })
    }

    // 2. ดึง schema จาก SQL Server
    const schemaQuery = `
      SELECT 
        COLUMN_NAME as name,
        DATA_TYPE as type,
        IS_NULLABLE as nullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'SALESCOMMISSION_Cache'
      ORDER BY ORDINAL_POSITION
    `
    const schema = await query(schemaQuery)

    // 3. สร้างตารางใน PostgreSQL (ถ้ายังไม่มี)
    console.log('Creating table in PostgreSQL...')
    await createTableFromSchema('salescommission_cache', schema)

    // 4. ล้างข้อมูลเก่า
    console.log('Clearing old data...')
    await clearTable('salescommission_cache')

    // 5. Insert ข้อมูลใหม่
    console.log('Inserting data to PostgreSQL...')
    const result = await insertData('salescommission_cache', data)

    return NextResponse.json({
      success: true,
      message: 'Data synced successfully',
      recordsProcessed: data.length,
      recordsInserted: result.count,
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to sync data',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

// API สำหรับดูสถานะ
export async function GET() {
  return NextResponse.json({
    message: 'Sync API is ready. Use POST to sync data from SQL Server to PostgreSQL',
    endpoint: '/api/sync-to-postgres',
    method: 'POST'
  })
}
