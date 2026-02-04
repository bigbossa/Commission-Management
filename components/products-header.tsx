"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function ProductsHeader() {
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/sync-to-postgres', {
        method: 'POST',
      })
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `${result.recordsInserted} records synced to PostgreSQL`,
        })
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Failed to sync data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to sync API",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SALESCOMMISSION_Cache</h1>
        <p className="text-muted-foreground mt-2">
          SQL Server Data Management
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync to PostgreSQL'}
        </Button>
      </div>
    </div>
  )
}
