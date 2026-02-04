"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, Download, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-2xl font-semibold text-foreground">Commission Dashboard</h1>
          <Link href="/sales">
            <Button variant="outline" size="sm" className="border-border bg-secondary text-foreground">
              Sales
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">Track and manage sales commissions</p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border bg-secondary text-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="text-foreground hover:bg-secondary">Last 7 days</DropdownMenuItem>
            <DropdownMenuItem className="text-foreground hover:bg-secondary">Last 30 days</DropdownMenuItem>
            <DropdownMenuItem className="text-foreground hover:bg-secondary">Last 90 days</DropdownMenuItem>
            <DropdownMenuItem className="text-foreground hover:bg-secondary">This year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" className="border-border bg-secondary text-foreground">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
        <ThemeToggle />
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
