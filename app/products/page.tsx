"use client"

import { ProductsTable } from "@/components/products-table"
import { ProductsHeader } from "@/components/products-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState, useCallback } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (page: number, search: string) => {
    let timeoutId: NodeJS.Timeout
    
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '100'
      })
      if (search.trim()) {
        params.append('search', search.trim())
      }
      
      const response = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
        cache: 'no-store'
      })
      
      clearTimeout(timeoutId!)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setProducts(result.data)
      setPagination(result.pagination)
    } catch (error: any) {
      console.error('Failed to fetch products:', error)
      if (error.name === 'AbortError') {
        setError('Request timeout - Database connection is taking too long')
      } else {
        setError(error.message || 'Failed to load data from SQL Server')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(currentPage, searchQuery)
  }, [currentPage, searchQuery, fetchProducts])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  if (loading && !products.length) {
    return (
      <div className="space-y-8">
        <ProductsHeader />
        <div className="rounded-lg border bg-card p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">Connecting to SQL Server...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <ProductsHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ProductsHeader />
      <ProductsTable 
        products={products} 
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        loading={loading}
      />
    </div>
  )
}
