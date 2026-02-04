import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  const startTime = Date.now()
  
  try {
    console.log('[API] Fetching data from SQL Server...')
    const data = await query('SELECT TOP 1000 * FROM SALESCOMMISSION_Cache')
    const duration = Date.now() - startTime
    
    console.log(`[API] Query completed in ${duration}ms, rows: ${data.length}`)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[API] Failed to fetch products after ${duration}ms:`, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error.message || 'Database connection error',
        duration: duration
      },
      { status: 500 }
    )
  }
}
