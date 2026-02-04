"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Download, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function ProductsHeader() {
  const [syncing, setSyncing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (syncing && progress < 90) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + 15
          if (prev < 60) return prev + 10
          if (prev < 90) return prev + 5
          return prev
        })
      }, 500)
    }
    return () => clearInterval(interval)
  }, [syncing, progress])

  const handleSync = async () => {
    setSyncing(true)
    setProgress(0)
    
    let currentProgress = 0
    const toastId = `sync-${Date.now()}`
    
    toast({
      id: toastId,
      title: "กำลัง Sync...",
      description: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>0% - เริ่มต้นการซิงค์ข้อมูล</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      ),
      duration: Infinity,
    })
    
    try {
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 15, 90)
        setProgress(currentProgress)
        
        toast({
          id: toastId,
          title: "กำลัง Sync...",
          description: (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{currentProgress}% - กำลังประมวลผลข้อมูล</span>
                <span className="font-mono font-bold">{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>
          ),
          duration: Infinity,
        })
      }, 600)

      const response = await fetch('/api/sync-to-postgres', {
        method: 'POST',
      })
      const result = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success) {
        toast({
          id: toastId,
          title: "✅ Sync สำเร็จ!",
          description: (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>ซิงค์ {result.recordsInserted.toLocaleString()} รายการเรียบร้อย</span>
                <span className="font-mono font-bold text-green-600">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          ),
          duration: 5000,
        })
      } else {
        toast({
          title: "❌ Sync ล้มเหลว",
          description: result.error || "Failed to sync data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับ API",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
      setProgress(0)
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
          {syncing ? `Syncing... ${progress}%` : 'Sync to PostgreSQL'}
        </Button>
      </div>
    </div>
  )
}
