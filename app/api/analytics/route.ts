import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const dimension = searchParams.get('dimension')
  
  try {
    console.log('[API] Fetching analytics data from SALESCOMMISSION_Cache...')
    
    // Query to get QTY sum by BPC_DIMENSION5_
    let queryString = `
      SELECT 
        BPC_DIMENSION5_,
        SUM(QTY) as TotalQTY
      FROM SALESCOMMISSION_Cache
      WHERE LASTSETTLEDATE IS NOT NULL AND BPC_DIMENSION5_ IS NOT NULL AND BPC_DIMENSION5_ != '' AND QTY > 0
    `
    
    if (startDate && endDate) {
      queryString += ` AND LASTSETTLEDATE >= '${startDate}' AND LASTSETTLEDATE <= '${endDate}'`
    } else if (year) {
      queryString += ` AND YEAR(LASTSETTLEDATE) = ${parseInt(year)}`
    }
    
    if (dimension) {
      queryString += ` AND BPC_DIMENSION5_ = '${dimension}'`
    }
    
    queryString += `
      GROUP BY BPC_DIMENSION5_
      ORDER BY BPC_DIMENSION5_
    `
    
    const data = await query(queryString)
    const duration = Date.now() - startTime
    
    console.log(`[API] Analytics query completed in ${duration}ms, rows: ${data.length}`)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[API] Failed to fetch analytics after ${duration}ms:`, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        message: error.message || 'Database connection error',
        duration: duration
      },
      { status: 500 }
    )
  }
}
