
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { generateGovReport } from "@/utils/export-utils"
import { governmentService } from "./service/governmentService"
import { format as formatDateFns } from "date-fns"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { budgetService, BudgetGov } from "./service/budgetService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function GovReports() {
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [fiscalYear, setFiscalYear] = useState("2024-2025")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selectedReportFormat, setSelectedReportFormat] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [historyData, setHistoryData] = useState<any[]>([])
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)
  const [fiscalYears, setFiscalYears] = useState<BudgetGov[]>([])

  useEffect(() => {
    fetchFiscalYears()
  }, [])

  const fetchFiscalYears = async () => {
    try {
      const data = await budgetService.getAllBudgetGov()
      setFiscalYears(data)
      if (data.length > 0) {
        // Try to find active one first, else use first one
        const active = data.find(f => f.fiscalState === "ACTIVE")
        if (active) setFiscalYear(active.fiscalYear)
        else setFiscalYear(data[0].fiscalYear)
      }
    } catch (error) {
      console.error("Error fetching fiscal years:", error)
    }
  }

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

  const getReportData = async (type: string, fromStr: string, toStr: string) => {
    switch (type) {
      case "summary":
        return await governmentService.getNationalSummaryReport(fromStr, toStr)
      case "financial":
        return await governmentService.getNationalFinancialReport(fiscalYear)
      case "nutrition":
        return await governmentService.getNationalNutritionAnalysisReport(fromStr, toStr)
      case "performance":
        return await governmentService.getNationalDistrictPerformanceReport(fromStr, toStr)
      case "supplier":
        return await governmentService.getNationalSupplierEvaluationReport(fromStr, toStr)
      default:
        return []
    }
  }

  const fetchHistoryReport = async () => {
    try {
      if (reportType === "all") {
        toast.error("Please select a specific category to view report")
        return
      }

      let fromStr = ""
      let toStr = ""

      if (reportType !== "financial") {
        if (!dateRange?.from || !dateRange?.to) {
          toast.error("Please select a date range")
          return
        }
        fromStr = formatDateFns(dateRange.from, 'yyyy-MM-dd')
        toStr = formatDateFns(dateRange.to, 'yyyy-MM-dd')
      }

      setIsFetchingHistory(true)
      const data = await getReportData(reportType, fromStr, toStr)
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

  const handleGenerateReport = async (type: string, category: string) => {
    try {
      let fromStr = ""
      let toStr = ""

      if (type !== "financial") {
        if (!dateRange?.from || !dateRange?.to) {
          toast.error("Please select a date range first")
          return
        }
        fromStr = formatDateFns(dateRange.from, 'yyyy-MM-dd')
        toStr = formatDateFns(dateRange.to, 'yyyy-MM-dd')
      }

      setIsGenerating(prev => ({ ...prev, [type]: true }))
      const format = (selectedReportFormat[type] || 'pdf') as 'pdf' | 'csv' | 'excel'

      const data = await getReportData(type, fromStr, toStr)

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

      await generateGovReport(
        category,
        { from: dateRange?.from, to: dateRange?.to },
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
    const format = 'pdf'

    const formattedData = historyData.map((item: any) => {
      const newItem: any = {}
      Object.keys(item).forEach(key => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
        newItem[formattedKey] = item[key]
      })
      return newItem
    })

    await generateGovReport(
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

  const reportCategories = [
    { value: "summary", label: "National Summary", description: "Comprehensive overview of the program" },
    { value: "financial", label: "Financial Report", description: "Budget and expenditure analysis" },
    { value: "nutrition", label: "Nutrition Analysis", description: "Nutritional standards compliance" },
    { value: "performance", label: "District Performance", description: "Performance across districts" },
    { value: "supplier", label: "Supplier Evaluation", description: "Supplier performance metrics" },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <FileText className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Reports & Analytics</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="generate">Generate Reports</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportCategories.map((cat) => (
                  <Card key={cat.value}>
                    <CardHeader>
                      <CardTitle>{cat.label}</CardTitle>
                      <CardDescription>{cat.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cat.value === "financial" ? (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Fiscal Year</label>
                            <Select value={fiscalYear} onValueChange={setFiscalYear}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fiscalYears.map(fy => (
                                  <SelectItem key={fy.id} value={fy.fiscalYear}>
                                    {fy.fiscalYear} 
                                  </SelectItem>
                                ))}
                                {fiscalYears.length === 0 && (
                                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date Range</label>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Report Format</label>
                          <Select
                            value={selectedReportFormat[cat.value] || "pdf"}
                            onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, [cat.value]: value }))}
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
                          onClick={() => handleGenerateReport(cat.value, cat.label)}
                          disabled={isGenerating[cat.value]}
                        >
                          {isGenerating[cat.value] ? "Generating..." : "Generate Report"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                  <div>
                    <CardTitle>Report Data</CardTitle>
                    <CardDescription>View live government report data</CardDescription>
                  </div>
                  {historyData.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleDownloadFromTable}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Category:</label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Select Categories</SelectItem>
                            {reportCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {reportType === "financial" ? (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">Fiscal Year:</label>
                          <Select value={fiscalYear} onValueChange={setFiscalYear}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fiscalYears.map(fy => (
                                <SelectItem key={fy.id} value={fy.fiscalYear}>
                                  {fy.fiscalYear}
                                </SelectItem>
                              ))}
                              {fiscalYears.length === 0 && (
                                <SelectItem value="2024-2025">2024-2025</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">Date Range:</label>
                          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                      )}

                      <Button
                        onClick={fetchHistoryReport}
                        disabled={isFetchingHistory}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isFetchingHistory ? "Fetching..." : "View Report"}
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
                            <TableHead>No data available. Select filters and click "View Report".</TableHead>
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
                            onClick={(e) => { e.preventDefault(); if (canPrev) setPage((p) => p - 1) }}
                            className={!canPrev ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            href="#"
                          />
                        </PaginationItem>

                        {getPageWindow().map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => { e.preventDefault(); setPage(p) }}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={(e) => { e.preventDefault(); if (canNext) setPage((p) => p + 1) }}
                            className={!canNext ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            href="#"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
