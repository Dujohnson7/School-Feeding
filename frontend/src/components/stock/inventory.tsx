
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpDown, Download, Filter, Package, Search } from "lucide-react"
import { stockService } from "./service/stockService"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { exportFoodTrackingSheetPDF, exportFoodTrackingSheetCSV, exportFoodTrackingSheetExcel } from "@/utils/export-utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Stock {
  id?: string
  created?: string
  updated?: string
  quantity?: number
  batchNumber?: string
  receivedDate?: string
  location?: string
  stockState?: "NORMAL" | "LOW" | "CRITICAL"
  item?: {
    id?: string
    name?: string
    foodCategory?: string
    unit?: string
  }
  school?: {
    id?: string
    name?: string
  }
}

// Local service definition removed

export function StockInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [inventoryItems, setInventoryItems] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"))
  const [exportFormat, setExportFormat] = useState<string>("pdf")
  const [isExporting, setIsExporting] = useState(false)
  const [distributions, setDistributions] = useState<any[]>([])

  // Fetch inventory on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        setError(null)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) {
          setError("School ID not found")
          return
        }
        const data = await stockService.getAllInventory(schoolId)
        setInventoryItems(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching inventory:", err)
        if (err.response?.status === 404) {
          setInventoryItems([])
          setError(null)
        } else {
          setError(err.response?.data || "Failed to fetch inventory")
          toast.error("Failed to load inventory")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  // Fetch distributions for tracking sheet
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) return

        const data = await stockService.getAllDistributions(schoolId)
        setDistributions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching distributions:", err)
      }
    }
    fetchDistributions()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, categoryFilter, statusFilter])

  // Helper function to format food category for display
  const formatCategory = (category?: string) => {
    if (!category) return "N/A"
    return category
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Filter inventory items based on search term and filters
  const filteredItems = (Array.isArray(inventoryItems) ? inventoryItems : []).filter((item) => {
    const itemName = item.item?.name || ""
    const itemId = item.id || ""
    const batchNumber = item.batchNumber || ""
    const foodCategory = item.item?.foodCategory || ""
    const stockState = item.stockState?.toUpperCase() || ""

    const matchesSearch =
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || foodCategory === categoryFilter
    const matchesStatus = statusFilter === "all" || stockState === statusFilter.toUpperCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize)

  const canPrev = page > 1
  const canNext = page < totalPages

  const getPageWindow = () => {
    const maxButtons = 5
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, page - half)
    let end = Math.min(totalPages, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const getStatusBadge = (status?: string) => {
    const stockState = status?.toUpperCase() || ""
    switch (stockState) {
      case "NORMAL":
        return <Badge className="bg-green-600 hover:bg-green-700">Normal</Badge>
      case "LOW":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Low
          </Badge>
        )
      case "CRITICAL":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && inventoryItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading inventory</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const handleExport = (format: string) => {
    setExportFormat(format)
    setExportDialogOpen(true)
  }

  const handleGenerateTrackingSheet = async () => {
    if (!selectedItem) {
      toast.error("Please select a food item")
      return
    }

    try {
      setIsExporting(true)
      const schoolId = localStorage.getItem("schoolId")
      const user = JSON.parse(localStorage.getItem("user") || "null")

      // Get school info
      const schoolInfo = {
        name: user?.school?.name || inventoryItems[0]?.school?.name || "N/A",
        id: schoolId || "N/A",
        district: user?.district?.district || user?.district || "N/A",
        community: "N/A" // You may need to add this to your data model
      }

      // Get selected item details
      const item = inventoryItems.find(i => i.item?.id === selectedItem)
      if (!item || !item.item) {
        toast.error("Item not found")
        return
      }

      const foodItem = {
        id: item.item.id,
        name: item.item.name || "N/A",
        unit: item.item.unit || "kg"
      }

      // Get month and year
      const [year, month] = selectedMonth.split("-")
      const monthYear = `${format(new Date(parseInt(year), parseInt(month) - 1, 1), "MMMM")} ${year}`

      // Prepare inventory data from distributions
      // Filter distributions by month and item
      const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1)
      const monthEnd = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)

      const relevantDistributions = distributions.filter(dist => {
        const distDate = new Date(dist.created || dist.date || "")
        return distDate >= monthStart && distDate <= monthEnd &&
          dist.stockOutItemDetails?.some((itemDetail: any) => itemDetail.item?.id === selectedItem)
      })

      // Generate daily data (simplified - you may need to adjust based on your data structure)
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
      const inventoryData: Array<{
        date: string
        stockAtStart: number
        foodReceived: number
        handedOut: number
        missing: number
        suspectedUnfit: number
        confirmedUnfit: number
        disposed: number
        stockAtEnd: number
        remarks: string
      }> = []

      let currentStock = item.quantity || 0

      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(parseInt(year), parseInt(month) - 1, i + 1)
        const dayDistributions = relevantDistributions.filter(dist => {
          const distDate = new Date(dist.created || dist.date || "")
          return distDate.getDate() === date.getDate()
        })

        const totalHandedOut = dayDistributions.reduce((sum, dist) => {
          const itemDetail = dist.stockOutItemDetails?.find((itemDetail: any) => itemDetail.item?.id === selectedItem)
          return sum + (itemDetail?.quantity || 0)
        }, 0)

        const stockAtStart = currentStock
        const foodReceived = 0 // You may need to fetch this from receiving records
        const stockAtEnd = stockAtStart + foodReceived - totalHandedOut
        currentStock = Math.max(0, stockAtEnd)

        inventoryData.push({
          date: date.toISOString(),
          stockAtStart: Math.max(0, stockAtStart),
          foodReceived: foodReceived,
          handedOut: totalHandedOut,
          missing: 0,
          suspectedUnfit: 0,
          confirmedUnfit: 0,
          disposed: 0,
          stockAtEnd: Math.max(0, stockAtEnd),
          remarks: ""
        })
      }

      // Export based on format
      if (exportFormat === "pdf") {
        await exportFoodTrackingSheetPDF(schoolInfo, foodItem, monthYear, inventoryData)
        toast.success("Food Tracking Sheet exported as PDF")
      } else if (exportFormat === "csv") {
        exportFoodTrackingSheetCSV(schoolInfo, foodItem, monthYear, inventoryData)
        toast.success("Food Tracking Sheet exported as CSV")
      } else if (exportFormat === "excel") {
        await exportFoodTrackingSheetExcel(schoolInfo, foodItem, monthYear, inventoryData)
        toast.success("Food Tracking Sheet exported as Excel")
      }

      setExportDialogOpen(false)
    } catch (err: any) {
      console.error("Error exporting tracking sheet:", err)
      toast.error(err.message || "Failed to export tracking sheet")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/stock-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Inventory Management</h1>
          </div>
          <HeaderActions role="stock" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage and track your food inventory</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, or batch number..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Filter:</span>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="GRAINS_ROOTS_TUBERS">Grains, Roots & Tubers</SelectItem>
                      <SelectItem value="PULSES_LEGUMES_NUTS">Pulses, Legumes & Nuts</SelectItem>
                      <SelectItem value="OILS_FATS">Oils & Fats</SelectItem>
                      <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                      <SelectItem value="FRUITS">Fruits</SelectItem>
                      <SelectItem value="ANIMAL_SOURCE_FOODS">Animal Source Foods</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      paginatedItems.map((item) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{item.item?.name || "N/A"}</TableCell>
                            <TableCell>{formatCategory(item.item?.foodCategory)}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity || 0} {item.item?.unit || "kg"}
                            </TableCell>
                            <TableCell>{getStatusBadge(item.stockState)}</TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          {inventoryItems.length === 0 ? "No inventory found" : "No inventory items found matching your search."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredItems.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredItems.length)} of {filteredItems.length}
                  </span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => { e.preventDefault(); if (canPrev) setPage((p) => p - 1) }}
                        className={!canPrev ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => { e.preventDefault(); setPage(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNext) setPage((p) => p + 1) }}
                        className={!canNext ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Food Tracking Sheet</DialogTitle>
            <DialogDescription>
              Generate a food tracking sheet in the format of Annex 3
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="food-item">Food Item *</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger id="food-item">
                  <SelectValue placeholder="Select food item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems
                    .filter(item => item.item?.name)
                    .map((item) => (
                      <SelectItem key={item.item?.id} value={item.item?.id || ""}>
                        {item.item?.name} ({item.quantity || 0} {item.item?.unit || "kg"})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month / Year *</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Export Format *</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateTrackingSheet}
              disabled={isExporting || !selectedItem}
            >
              {isExporting ? "Exporting..." : "Generate & Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
