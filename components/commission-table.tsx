"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronDown, MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

type CommissionRecord = {
  id: string
  salesRep: string
  deal: string
  dealValue: number
  commissionRate: number
  commission: number
  status: "Paid" | "Pending" | "Processing"
  date: string
}

const commissionData: CommissionRecord[] = [
  {
    id: "COM-001",
    salesRep: "Sarah Johnson",
    deal: "Enterprise License - Acme Corp",
    dealValue: 125000,
    commissionRate: 8,
    commission: 10000,
    status: "Paid",
    date: "2026-01-28",
  },
  {
    id: "COM-002",
    salesRep: "Michael Chen",
    deal: "Annual Subscription - TechStart",
    dealValue: 45000,
    commissionRate: 10,
    commission: 4500,
    status: "Pending",
    date: "2026-01-30",
  },
  {
    id: "COM-003",
    salesRep: "Emily Rodriguez",
    deal: "Platform Upgrade - GlobalRetail",
    dealValue: 78500,
    commissionRate: 7.5,
    commission: 5887.5,
    status: "Processing",
    date: "2026-01-29",
  },
  {
    id: "COM-004",
    salesRep: "David Kim",
    deal: "Multi-year Contract - FinanceHub",
    dealValue: 250000,
    commissionRate: 9,
    commission: 22500,
    status: "Paid",
    date: "2026-01-25",
  },
  {
    id: "COM-005",
    salesRep: "Lisa Thompson",
    deal: "Starter Plan - NewVenture",
    dealValue: 12000,
    commissionRate: 12,
    commission: 1440,
    status: "Paid",
    date: "2026-01-27",
  },
  {
    id: "COM-006",
    salesRep: "James Wilson",
    deal: "Custom Solution - MegaCorp",
    dealValue: 180000,
    commissionRate: 8.5,
    commission: 15300,
    status: "Pending",
    date: "2026-02-01",
  },
  {
    id: "COM-007",
    salesRep: "Sarah Johnson",
    deal: "Expansion Deal - Acme Corp",
    dealValue: 65000,
    commissionRate: 8,
    commission: 5200,
    status: "Processing",
    date: "2026-02-02",
  },
  {
    id: "COM-008",
    salesRep: "Michael Chen",
    deal: "Team License - DevAgency",
    dealValue: 32000,
    commissionRate: 10,
    commission: 3200,
    status: "Paid",
    date: "2026-01-22",
  },
]

const statusStyles = {
  Paid: "bg-primary/20 text-primary border-primary/30",
  Pending: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Processing: "bg-chart-1/20 text-chart-1 border-chart-1/30",
}

export function CommissionTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [sortConfig, setSortConfig] = useState<{ key: keyof CommissionRecord; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredData = commissionData.filter((record) => {
    const matchesSearch =
      record.salesRep.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.deal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    const aValue = a[key]
    const bValue = b[key]
    if (aValue < bValue) return direction === "asc" ? -1 : 1
    if (aValue > bValue) return direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: keyof CommissionRecord) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Commission Records</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 sm:w-64 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto border-border bg-secondary text-foreground">
                  Status: {statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {["All", "Paid", "Pending", "Processing"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setCurrentPage(1)
                    }}
                    className="text-foreground hover:bg-secondary"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                <TableHead
                  className="text-muted-foreground font-medium cursor-pointer"
                  onClick={() => handleSort("salesRep")}
                >
                  <div className="flex items-center gap-1">
                    Sales Rep
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Deal</TableHead>
                <TableHead
                  className="text-muted-foreground font-medium cursor-pointer text-right"
                  onClick={() => handleSort("dealValue")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Deal Value
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-center hidden lg:table-cell">Rate</TableHead>
                <TableHead
                  className="text-muted-foreground font-medium cursor-pointer text-right"
                  onClick={() => handleSort("commission")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Commission
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record) => (
                  <TableRow key={record.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-mono text-sm text-muted-foreground">{record.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{record.salesRep}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                      {record.deal}
                    </TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(record.dealValue)}</TableCell>
                    <TableCell className="text-center text-muted-foreground hidden lg:table-cell">
                      {record.commissionRate}%
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {formatCurrency(record.commission)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusStyles[record.status]}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="text-foreground hover:bg-secondary">View details</DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-secondary">Edit record</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-secondary">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border bg-secondary text-foreground disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border bg-secondary text-foreground disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
