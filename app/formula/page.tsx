"use client"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Calculator, TrendingUp } from "lucide-react"

export default function FormulaPage() {
  // ตัวอย่างการคำนวณ
  const examples = [
    { qty: 500, first: 500, remaining: 0, rate1: 5, rate2: 8, commission: 2500, avgRate: 5 },
    { qty: 1000, first: 1000, remaining: 0, rate1: 5, rate2: 8, commission: 5000, avgRate: 5 },
    { qty: 1500, first: 1000, remaining: 500, rate1: 5, rate2: 8, commission: 9000, avgRate: 6 },
    { qty: 2000, first: 1000, remaining: 1000, rate1: 5, rate2: 8, commission: 13000, avgRate: 6.5 },
    { qty: 3000, first: 1000, remaining: 2000, rate1: 5, rate2: 8, commission: 21000, avgRate: 7 },
    { qty: 5000, first: 1000, remaining: 4000, rate1: 5, rate2: 8, commission: 37000, avgRate: 7.4 },
    { qty: 10000, first: 1000, remaining: 9000, rate1: 5, rate2: 8, commission: 77000, avgRate: 7.7 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">สูตรคำนวณ Commission</h1>
        <p className="text-muted-foreground mt-2">
          อธิบายรายละเอียดการคำนวณค่า Commission แบบขั้นบันได
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4" />
        <AlertTitle>หลักการคำนวณ</AlertTitle>
        <AlertDescription>
          ระบบใช้สูตรการคำนวณแบบ Progressive Rate (อัตราขั้นบันได) เพื่อให้ยุติธรรมกับปริมาณการขายที่แตกต่างกัน
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">สูตรการคำนวณ</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">กรณีที่ QTY ≤ 1,000</h3>
              <div className="bg-muted p-4 rounded-lg font-mono">
                <p className="text-sm text-muted-foreground mb-2">Commission =</p>
                <p className="text-xl font-bold">QTY × 5 บาท</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">กรณีที่ QTY &gt; 1,000</h3>
              <div className="bg-muted p-4 rounded-lg font-mono space-y-2">
                <p className="text-sm text-muted-foreground">Commission =</p>
                <p className="text-lg font-bold">(1,000 × 5) + ((QTY - 1,000) × 8)</p>
                <p className="text-sm text-green-600 font-semibold">= 5,000 + ((QTY - 1,000) × 8)</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">อัตราเฉลี่ย</h3>
              <div className="bg-muted p-4 rounded-lg font-mono">
                <p className="text-sm text-muted-foreground mb-2">Average Rate =</p>
                <p className="text-xl font-bold">Commission ÷ QTY</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">อัตราค่า Commission</h2>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">ช่วงที่ 1</span>
                <Badge variant="default">5 บาท/QTY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                สำหรับ 1,000 หน่วยแรก
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                QTY: 1 - 1,000 หน่วย
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">ช่วงที่ 2</span>
                <Badge variant="default" className="bg-green-600">8 บาท/QTY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                สำหรับส่วนที่เกิน 1,000 หน่วย
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                QTY: &gt; 1,000 หน่วย
              </p>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>หมายเหตุ:</strong> อัตราจะสูงขึ้นเมื่อยอดขายเกิน 1,000 หน่วย เพื่อเป็นแรงจูงใจในการเพิ่มยอดขาย
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">ตัวอย่างการคำนวณ</h2>
        
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
              <h3 className="font-semibold mb-2">ตัวอย่าง 1: QTY = 500</h3>
              <div className="space-y-1 text-sm">
                <p>500 ≤ 1,000 → ใช้อัตรา 5 บาท</p>
                <p className="font-mono">Commission = 500 × 5</p>
                <p className="font-mono text-lg font-bold text-green-600">= 2,500 บาท</p>
                <p className="text-muted-foreground">อัตราเฉลี่ย = 5.00 บาท/QTY</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
              <h3 className="font-semibold mb-2">ตัวอย่าง 2: QTY = 2,000</h3>
              <div className="space-y-1 text-sm">
                <p>2,000 &gt; 1,000 → ใช้ทั้ง 2 อัตรา</p>
                <p className="font-mono">= (1,000 × 5) + (1,000 × 8)</p>
                <p className="font-mono">= 5,000 + 8,000</p>
                <p className="font-mono text-lg font-bold text-green-600">= 13,000 บาท</p>
                <p className="text-muted-foreground">อัตราเฉลี่ย = 6.50 บาท/QTY</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold bg-primary text-primary-foreground">QTY (หน่วย)</TableHead>
                  <TableHead className="font-bold bg-primary text-primary-foreground text-center">1,000 แรก (×5)</TableHead>
                  <TableHead className="font-bold bg-primary text-primary-foreground text-center">ส่วนเกิน (×8)</TableHead>
                  <TableHead className="font-bold bg-primary text-primary-foreground text-right">Commission (บาท)</TableHead>
                  <TableHead className="font-bold bg-primary text-primary-foreground text-right">อัตราเฉลี่ย (บาท/QTY)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examples.map((example, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-semibold">{example.qty.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-mono">
                      {example.first.toLocaleString()} × 5 = {(example.first * 5).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {example.remaining > 0 
                        ? `${example.remaining.toLocaleString()} × 8 = ${(example.remaining * 8).toLocaleString()}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right font-mono text-lg font-semibold text-green-600">
                      {example.commission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-600">
                      {example.avgRate.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">กราฟแสดงความสัมพันธ์</h2>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>สังเกตพฤติกรรม</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>อัตราเฉลี่ยจะเพิ่มขึ้นจาก 5 บาท เมื่อ QTY มากขึ้น</li>
                <li>อัตราเฉลี่ยสูงสุด = 8 บาท (เมื่อ QTY เข้าใกล้อนันต์)</li>
                <li>ณ QTY = 1,000: อัตราเฉลี่ย = 5.00 บาท</li>
                <li>ณ QTY = 10,000: อัตราเฉลี่ย = 7.70 บาท</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-center">สูตรทั่วไป (TypeScript)</h3>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`const calculateCommission = (qty: number): number => {
  if (qty <= 1000) {
    return qty * 5
  } else {
    const first1000 = 1000 * 5  // 5,000
    const remaining = (qty - 1000) * 8
    return first1000 + remaining
  }
}

const calculateAvgRate = (qty: number): number => {
  if (qty === 0) return 0
  const commission = calculateCommission(qty)
  return commission / qty
}

// ตัวอย่างการใช้งาน
const qty = 2000
const commission = calculateCommission(qty)     // 13,000
const avgRate = calculateAvgRate(qty)           // 6.5`}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}
