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
    
    // Complete list of all employees with their names
    const allEmployees = [
      { code: 'Y810004', name: 'จันทนา สีลาสงวน(พี่ตา)' },
      { code: 'Y810100', name: 'นันทรัตน์ ชัยพัฒน์สาร(นุ้ย)' },
      { code: 'Y510310', name: 'สรวิชญ์ ศรีสังวรณ์(นกหวีด)' },
      { code: 'Y510172', name: 'อำนาจ ตะโส(เกี้ย)' },
      { code: 'Y810482', name: 'สุทัศน์ ฝ่นเรือง(หมี)' },
      { code: 'Y810130', name: 'อรวรรณ ศรีจันดา(หนึ่ง)' },
      { code: 'Y110026', name: 'วุฒิพงศ์ เสริมสุข (เล็ก)' },
      { code: 'Y510267', name: 'ณัฐฐจิรัชยา ฤทธิ์สำอางค์(กานต์)' },
      { code: 'Y111196', name: 'ศุภัคษิ์ชยา พันธ์แจ่ม(มุก)' },
      { code: 'Y111200', name: 'บุษยา วิกยานนท์ (อุ้ย)' },
      { code: 'Y111217', name: 'ปัญจรัตน์ ศิริกาญจน์เศวต (ปันปัน)' },
      { code: 'Y111199', name: 'อภิญญา มาตทอง (ตั๊ก)' },
      { code: 'Y111009', name: 'ธนพรรณ แสงสุวรรณ์ (ทราย)' },
      { code: 'Y111221', name: 'ฐิตาภากาญจน์ ภูหิรัญประเสริญ (หมวย)' },
      { code: 'Y510091', name: 'ปัทมา เฟื่องฟุ้ง (ปัท)' },
      { code: 'Y810504', name: 'เศรษฐ์ฐภัทร พรรณานนท์(ติ)' },
      { code: 'Y810510', name: 'ธิติพงศ์ สัตยดิษฐ์(หนึ่ง)' },
      { code: 'Y111242', name: 'ชมพูนุช สงวนพัฒน์(เอจ)' }
    ]
    
    const allowedCodes = allEmployees.map(emp => emp.code)
    
    // Query to get QTY sum by BPC_DIMENSION5_
    let queryString = `
      SELECT 
        BPC_DIMENSION5_,
        SUM(QTY) as TotalQTY
      FROM SALESCOMMISSION_Cache
      WHERE LASTSETTLEDATE IS NOT NULL AND BPC_DIMENSION5_ IS NOT NULL AND BPC_DIMENSION5_ != '' AND QTY > 0
        AND (
          ${allowedCodes.map(code => `BPC_DIMENSION5_ LIKE '${code}%'`).join(' OR ')}
        )
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
    
    const dbData = await query(queryString)
    
    // Create a map of database results
    const dbMap = new Map()
    dbData.forEach((row: any) => {
      const code = row.BPC_DIMENSION5_.split(',')[0]
      dbMap.set(code, row.TotalQTY)
    })
    
    // Merge with all employees list
    const data = allEmployees.map(emp => ({
      EmployeeCode: emp.code,
      EmployeeName: emp.name,
      BPC_DIMENSION5_: `${emp.code},${emp.name}`,
      TotalQTY: dbMap.get(emp.code) || 0
    }))
    
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
