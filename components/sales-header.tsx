"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function SalesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CustSettle_Cache</h1>
        <p className="text-muted-foreground mt-2">
          Customer Settlement Data from SQL Server
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
