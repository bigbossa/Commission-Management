import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '100')
  const offset = (page - 1) * pageSize
  
  try {
    console.log(`[API] Fetching page ${page} from CustSettle_Cache (${pageSize} records)...`)
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) as total FROM CustSettle_Cache')
    const total = countResult[0].total
    
    // Get paginated data
    const data = await query(`
      SELECT * FROM CustSettle_Cache 
      ORDER BY TRANSDATE DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `)
    
    const duration = Date.now() - startTime
    
    console.log(`[API] Query completed in ${duration}ms, rows: ${data.length}, total: ${total}`)
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[API] Failed to fetch sales data after ${duration}ms:`, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sales data',
        message: error.message || 'Database connection error',
        duration: duration
      },
      { status: 500 }
    )
  }
}
