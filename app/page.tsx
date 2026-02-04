"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Calculator, 
  Database, 
  FileText, 
  TrendingUp,
  Package,
  ShoppingCart,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function CommissionDashboard() {
  const features = [
    {
      title: "Analytics Dashboard",
      description: "วิเคราะห์ QTY และ Commission แบ่งตาม BPC_DIMENSION5_ พร้อมฟิลเตอร์ตามปี (พ.ศ.) และช่วงวันที่",
      icon: BarChart3,
      href: "/analytics",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "สูตรคำนวณ Commission",
      description: "อธิบายรายละเอียดการคำนวณค่า Commission แบบขั้นบันได พร้อมตัวอย่างและโค้ด",
      icon: Calculator,
      href: "/formula",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "SALESCOMMISSION Data",
      description: "ข้อมูลจาก SALESCOMMISSION_Cache ทั้งหมด 28 columns พร้อมระบบ Pagination",
      icon: Package,
      href: "/products",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "CustSettle Data",
      description: "ข้อมูลลูกค้าและการตัดยอดจาก CustSettle_Cache",
      icon: ShoppingCart,
      href: "/sales",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ]

  const highlights = [
    {
      label: "Commission Rate",
      value: "5-8 บาท",
      description: "แบบขั้นบันได",
    },
    {
      label: "Data Sources",
      value: "2 Tables",
      description: "SQL Server",
    },
    {
      label: "Filters",
      value: "3 Types",
      description: "Year, Range, Dimension",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Commission Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            ระบบจัดการและวิเคราะห์ข้อมูล Commission จาก SALESCOMMISSION_Cache
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          v1.0.0
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.label} className="p-6">
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="text-2xl font-bold mt-1">{item.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Commission Calculation Formula
        </h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="font-semibold mb-1">ช่วงที่ 1: QTY ≤ 1,000</div>
              <div className="font-mono text-lg">Commission = QTY × 5 บาท</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-semibold mb-1">ช่วงที่ 2: QTY &gt; 1,000</div>
              <div className="font-mono text-lg">Commission = 5,000 + ((QTY - 1,000) × 8)</div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">ตัวอย่าง: QTY = 2,000 หน่วย</div>
            <div className="font-mono text-sm space-y-1">
              <div>Commission = (1,000 × 5) + (1,000 × 8)</div>
              <div className="text-lg font-bold text-green-600">= 5,000 + 8,000 = 13,000 บาท</div>
              <div className="text-muted-foreground">อัตราเฉลี่ย = 13,000 ÷ 2,000 = 6.50 บาท/QTY</div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/formula">
              <Button variant="outline">
                ดูรายละเอียดเพิ่มเติม
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="font-semibold min-w-[200px]">SQL Server:</div>
            <div className="text-muted-foreground">192.168.2.26 / UAT_Cache</div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="font-semibold min-w-[200px]">Main Table:</div>
            <div className="text-muted-foreground">SALESCOMMISSION_Cache (28 columns)</div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="font-semibold min-w-[200px]">Key Fields:</div>
            <div className="text-muted-foreground">BPC_DIMENSION5_, LASTSETTLEDATE, QTY</div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="font-semibold min-w-[200px]">PostgreSQL Sync:</div>
            <div className="text-muted-foreground">localhost:5432 / commission_db (Optional)</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Start
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">1.</span>
                <span>ไปที่ <strong>Analytics</strong> เพื่อดูสรุปข้อมูล Commission</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">2.</span>
                <span>เลือกฟิลเตอร์ตามปี (พ.ศ.) หรือช่วงวันที่</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">3.</span>
                <span>กรองตาม BPC_DIMENSION5_ เพื่อดูแต่ละหมวดหมู่</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">4.</span>
                <span>ดูสูตรคำนวณที่ <strong>สูตรคำนวณ</strong> สำหรับรายละเอียด</span>
              </li>
            </ul>
          </div>
          <Link href="/analytics">
            <Button size="lg" className="whitespace-nowrap">
              เริ่มใช้งาน
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
