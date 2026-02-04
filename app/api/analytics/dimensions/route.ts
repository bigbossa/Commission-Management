import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  const startTime = Date.now()
  
  try {
    console.log('[API] Fetching BPC_DIMENSION5_ values from SALESCOMMISSION_Cache...')
    
    const queryString = `
      SELECT DISTINCT BPC_DIMENSION5_
      FROM SALESCOMMISSION_Cache
      WHERE BPC_DIMENSION5_ IS NOT NULL AND BPC_DIMENSION5_ != ''
      ORDER BY BPC_DIMENSION5_
    `
    
    const data = await query(queryString)
    const duration = Date.now() - startTime
    
    console.log(`[API] Dimensions query completed in ${duration}ms, rows: ${data.length}`)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[API] Failed to fetch dimensions after ${duration}ms:`, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dimensions data',
        message: error.message || 'Database connection error',
        duration: duration
      },
      { status: 500 }
    )
  }
}
