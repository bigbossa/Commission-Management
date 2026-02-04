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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface SalesData {
  [key: string]: any
}

interface SalesTableProps {
  salesData: SalesData[]
}

export function SalesTable({ salesData }: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  if (!salesData || salesData.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Get column names from first record
  const columns = Object.keys(salesData[0])

  // Calculate pagination
  const totalPages = Math.ceil(salesData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = salesData.slice(startIndex, endIndex)

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total Records: <strong>{salesData.length}</strong> | 
          Total Columns: <strong>{columns.length}</strong> |
          Showing: <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, salesData.length)}</strong>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card overflow-x-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-card border-r font-bold">
                  #
                </TableHead>
                {columns.map((column) => (
                  <TableHead key={column} className="whitespace-nowrap font-semibold min-w-[120px]">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((record, index) => {
                const actualIndex = startIndex + index
                return (
                  <TableRow key={actualIndex}>
                    <TableCell className="sticky left-0 z-10 bg-card border-r font-medium">
                      {actualIndex + 1}
                    </TableCell>
                    {columns.map((column) => {
                      const value = record[column]
                      
                      // Format different data types
                      let displayValue = value
                      let cellClass = "whitespace-nowrap min-w-[120px]"
                      
                      if (value === null || value === undefined) {
                        displayValue = '-'
                        cellClass += " text-muted-foreground"
                      } else if (typeof value === 'number') {
                        // Format numbers
                        if (column.includes('PRICE') || column.includes('AMOUNT') || column.includes('CUR') || column.includes('MST') || column.includes('BALANCE')) {
                          displayValue = value.toLocaleString('en-US', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })
                          cellClass += " text-right font-mono"
                        } else {
                          displayValue = value.toLocaleString()
                          cellClass += " text-right"
                        }
                      } else if (value instanceof Date || column.includes('DATE')) {
                        // Format dates
                        try {
                          const date = new Date(value)
                          if (!isNaN(date.getTime())) {
                            displayValue = date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          } else {
                            displayValue = String(value)
                          }
                        } catch {
                          displayValue = String(value)
                        }
                        cellClass += " text-sm"
                      } else {
                        displayValue = String(value)
                        if (displayValue.length > 50) {
                          displayValue = displayValue.substring(0, 47) + '...'
                        }
                      }

                      return (
                        <TableCell key={column} className={cellClass} title={String(value)}>
                          {displayValue}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Displaying {currentData.length} of {salesData.length} records
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground p-4 bg-muted rounded-lg">
        <div className="font-semibold mb-2">All Columns ({columns.length}):</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {columns.map((col, idx) => (
            <div key={col} className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {idx + 1}
              </Badge>
              <span className="font-mono text-xs">{col}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
