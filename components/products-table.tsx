"use client"

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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  [key: string]: any
}

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface ProductsTableProps {
  products: Product[]
  pagination: PaginationInfo | null
  currentPage: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  searchQuery: string
  loading: boolean
}

export function ProductsTable({ products, pagination, currentPage, onPageChange, onSearch, searchQuery, loading }: ProductsTableProps) {
  const [inputValue, setInputValue] = useState(searchQuery)

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">Loading data...</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Get column names from first record
  const columns = Object.keys(products[0])

  // Use products directly (filtering is done server-side now)
  const filteredProducts = products

  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0
  const startIndex = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1
  const endIndex = pagination ? Math.min(pagination.page * pagination.pageSize, total) : products.length

  const goToFirstPage = () => onPageChange(1)
  const goToLastPage = () => onPageChange(totalPages)
  const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1))
  const goToNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1))

  // Handle search with debounce
  const handleSearchSubmit = () => {
    onSearch(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const clearSearch = () => {
    setInputValue("")
    onSearch("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Total Records: <strong>{total.toLocaleString()}</strong> | 
          Total Columns: <strong>{columns.length}</strong>
          {searchQuery && (
            <span> | ค้นหา: <strong className="text-primary">"{searchQuery}"</strong></span>
          )}
        </div>
        
        <div className="relative w-full sm:w-80 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ค้นหาทั้งหมด (กด Enter)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
            />
            {inputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing: <strong>{total > 0 ? startIndex.toLocaleString() : 0}</strong> - <strong>{endIndex.toLocaleString()}</strong>
          {searchQuery && (
            <span className="text-primary"> (filtered)</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
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
              {filteredProducts.map((product, index) => {
                const actualIndex = startIndex + index - 1
                return (
                  <TableRow key={actualIndex}>
                    <TableCell className="sticky left-0 z-10 bg-card border-r font-medium">
                      {actualIndex + 1}
                    </TableCell>
                    {columns.map((column) => {
                      const value = product[column]
                      
                      // Format different data types
                      let displayValue = value
                      let cellClass = "whitespace-nowrap min-w-[120px]"
                      
                      if (value === null || value === undefined) {
                        displayValue = '-'
                        cellClass += " text-muted-foreground"
                      } else if (typeof value === 'number') {
                        // Format numbers
                        if (column.includes('PRICE') || column.includes('AMOUNT') || column.includes('CUR') || column.includes('MST')) {
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
          Displaying {filteredProducts.length} of {total.toLocaleString()} total records (Page {currentPage} of {totalPages})
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages || totalPages === 0}
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
