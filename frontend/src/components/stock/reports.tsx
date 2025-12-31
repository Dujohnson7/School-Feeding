
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Download, FileText, Filter } from "lucide-react"
import { toast } from "sonner"
import { generateStockReport } from "@/utils/export-utils"
import { stockService } from "./service/stockService"
import { format as formatDateFns } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function StockReports() {
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selectedReportFormat, setSelectedReportFormat] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [historyData, setHistoryData] = useState<any[]>([])
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [reportType, dateRange])

  const reportDataToDisplay = historyData

  const totalPages = Math.max(1, Math.ceil(reportDataToDisplay.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedReports = reportDataToDisplay.slice(startIndex, startIndex + pageSize)

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

  const fetchHistoryReport = async () => {
    try {
      if (reportType === "all") {
        toast.error("Please select a specific category to view report data")
        return
      }
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Please select a date range")
        return
      }

      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      setIsFetchingHistory(true)
      const fromStr = formatDateFns(dateRange.from, 'yyyy-MM-dd')
      const toStr = formatDateFns(dateRange.to, 'yyyy-MM-dd')

      const data = await getReportData(reportType, schoolId, fromStr, toStr)
      setHistoryData(data || [])
      setPage(1)
      if (!data || data.length === 0) {
        toast.info("No data found for the selected period")
      }
    } catch (error: any) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to fetch report data")
    } finally {
      setIsFetchingHistory(false)
    }
  }

  const getReportData = async (type: string, schoolId: string, fromStr: string, toStr: string) => {
    switch (type) {
      case "movement":
        return await stockService.getStockMovementReport(schoolId, fromStr, toStr)
      case "inventory":
        return await stockService.getInventoryManagementReport(schoolId, fromStr, toStr)
      case "receiving":
        return await stockService.getGoodsReceivingReport(schoolId, fromStr, toStr)
      case "distribution":
        return await stockService.getFoodDistributionReport(schoolId, fromStr, toStr)
      default:
        return []
    }
  }

  const handleGenerateReport = async (type: string, category: string) => {
    try {
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Please select a date range first")
        return
      }

      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      setIsGenerating(prev => ({ ...prev, [type]: true }))
      const format = (selectedReportFormat[type] || 'pdf') as 'pdf' | 'csv' | 'excel'

      const fromStr = formatDateFns(dateRange.from, 'yyyy-MM-dd')
      const toStr = formatDateFns(dateRange.to, 'yyyy-MM-dd')

      const data = await getReportData(type, schoolId, fromStr, toStr)

      if (!data || data.length === 0) {
        toast.info("No data found for the selected period")
        return
      }

      const formattedData = data.map((item: any) => {
        const newItem: any = {}
        Object.keys(item).forEach(key => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
          newItem[formattedKey] = item[key]
        })
        return newItem
      })

      await generateStockReport(
        category,
        { from: dateRange.from, to: dateRange.to },
        format,
        formattedData
      )

      toast.success(`${category} report generated successfully`)
    } catch (error: any) {
      console.error('Error generating report:', error)
      toast.error(error.message || 'Failed to generate report')
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleDownloadFromTable = async () => {
    if (historyData.length === 0) return
    const category = reportCategories.find(c => c.value === reportType)?.label || reportType
    const format = 'pdf' // Default for table download

    const formattedData = historyData.map((item: any) => {
      const newItem: any = {}
      Object.keys(item).forEach(key => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
        newItem[formattedKey] = item[key]
      })
      return newItem
    })

    await generateStockReport(
      category,
      { from: dateRange?.from, to: dateRange?.to },
      format,
      formattedData
    )
  }

  const getTableColumns = () => {
    if (historyData.length === 0) return []
    return Object.keys(historyData[0])
  }

  const formatHeader = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  }

  const handleDownload = (reportId: string) => {
    console.log(`Downloading report ${reportId}`)
    alert(`Report ${reportId} download started.`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Processing
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const reportCategories = [
    { value: "movement", label: "Stock Movement", description: "Daily stock in/out movements and transactions" },
    { value: "inventory", label: "Inventory Management", description: "Current stock levels and inventory valuation" },
    { value: "receiving", label: "Goods Receiving", description: "Goods received from suppliers and quality checks" },
    { value: "distribution", label: "Food Distribution", description: "Food distribution to kitchen and consumption" },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/stock-dashboard" className="lg:hidden">
            <FileText className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Stock Reports</h1>
          </div>
          <HeaderActions role="stock" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="generate">Generate Reports</TabsTrigger>
              <TabsTrigger value="history">Report</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportCategories.map((category) => (
                  <Card key={category.value}>
                    <CardHeader>
                      <CardTitle>{category.label}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date Range</label>
                          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Report Format</label>
                          <Select
                            value={selectedReportFormat[category.value] || "pdf"}
                            onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, [category.value]: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Report</SelectItem>
                              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                              <SelectItem value="csv">CSV Data</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleGenerateReport(category.value, category.label)}
                          disabled={isGenerating[category.value]}
                        >
                          {isGenerating[category.value] ? "Generating..." : "Generate Report"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Report Data View</CardTitle>
                    <CardDescription>View live stock management data based on filters</CardDescription>
                  </div>
                  {historyData.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleDownloadFromTable}>
                      <Download className="mr-2 h-4 w-4" />
                      Download view
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Category:</label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Select Categories</SelectItem>
                            <SelectItem value="movement">Stock Movement</SelectItem>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="receiving">Receiving</SelectItem>
                            <SelectItem value="distribution">Distribution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Date Range:</label>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                      </div>

                      <Button
                        onClick={fetchHistoryReport}
                        disabled={isFetchingHistory}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isFetchingHistory ? "Fetching..." : "View Report Data"}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {historyData.length > 0 ? (
                            getTableColumns().map((col) => (
                              <TableHead key={col} className="whitespace-nowrap">
                                {formatHeader(col)}
                              </TableHead>
                            ))
                          ) : (
                            <TableHead>No data available. Select filters and click "View Report Data".</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportDataToDisplay.length > 0 ? (
                          paginatedReports.map((item, idx) => (
                            <TableRow key={idx}>
                              {getTableColumns().map((col) => (
                                <TableCell key={col} className="whitespace-nowrap">
                                  {item[col] !== null && item[col] !== undefined ? String(item[col]) : "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={getTableColumns().length || 1} className="h-24 text-center">
                              {isFetchingHistory ? "Loading data..." : "No results to display."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {reportDataToDisplay.length > pageSize && (
                    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          Showing {Math.min(reportDataToDisplay.length, (page - 1) * pageSize + 1)}–
                          {Math.min(page * pageSize, reportDataToDisplay.length)} of {reportDataToDisplay.length}
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
                              onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
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
                              onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                              href="#"
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
