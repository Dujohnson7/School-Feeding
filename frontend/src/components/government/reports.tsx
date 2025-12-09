
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  Home,
  Search,
} from "lucide-react"
import { toast } from "sonner"
import { generateGovReport } from "@/utils/export-utils"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function GovReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selectedReportFormat, setSelectedReportFormat] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})

  const reports = [
    {
      id: "RPT-2025-042",
      title: "National School Feeding Summary",
      type: "summary",
      period: "March 2025",
      generatedDate: "Apr 1, 2025",
      status: "completed", 
    },
    {
      id: "RPT-2025-041",
      title: "Budget Utilization Report",
      type: "financial",
      period: "Q1 2025",
      generatedDate: "Mar 31, 2025",
      status: "completed", 
    },
    {
      id: "RPT-2025-040",
      title: "Nutrition Compliance Analysis",
      type: "nutrition",
      period: "March 2025",
      generatedDate: "Mar 30, 2025",
      status: "completed", 
    },
    {
      id: "RPT-2025-039",
      title: "Supplier Performance Evaluation",
      type: "supplier",
      period: "Q1 2025",
      generatedDate: "Mar 29, 2025",
      status: "completed", 
    },
    {
      id: "RPT-2025-038",
      title: "District Performance Comparison",
      type: "performance",
      period: "March 2025",
      generatedDate: "Mar 28, 2025",
      status: "completed", 
    },
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === "all" || report.type === reportType
    return matchesSearch && matchesType
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, reportType, dateRange])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize)

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

  const handleGenerateReport = async (type: string) => {
    try {
      setIsGenerating(prev => ({ ...prev, [type]: true }))
      const format = (selectedReportFormat[type] || 'pdf') as 'pdf' | 'csv' | 'excel'
      
      // Sample data - in real app, fetch from API based on type and dateRange
      const sampleData = [
        { 'Province': 'Kigali', 'Districts': 3, 'Schools': 150, 'Students': 45000 },
        { 'Province': 'Eastern', 'Districts': 7, 'Schools': 200, 'Students': 60000 },
        { 'Province': 'Northern', 'Districts': 5, 'Schools': 120, 'Students': 36000 },
        { 'Province': 'Western', 'Districts': 7, 'Schools': 180, 'Students': 54000 },
        { 'Province': 'Southern', 'Districts': 8, 'Schools': 220, 'Students': 66000 }
      ]
      
      await generateGovReport(
        type,
        { from: dateRange?.from, to: dateRange?.to },
        format,
        sampleData
      )
      
      toast.success(`${type} report generated successfully`)
    } catch (error: any) {
      console.error('Error generating report:', error)
      toast.error(error.message || 'Failed to generate report')
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }))
    }
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
                <Card>
                  <CardHeader>
                    <CardTitle>National Summary Report</CardTitle>
                    <CardDescription>Comprehensive overview of the school feeding program</CardDescription>
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
                          value={selectedReportFormat["summary"] || "pdf"}
                          onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, "summary": value }))}
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
                        onClick={() => handleGenerateReport("National Summary")}
                        disabled={isGenerating["summary"]}
                      >
                        {isGenerating["summary"] ? "Generating..." : "Generate Report"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Report</CardTitle>
                    <CardDescription>Budget utilization and financial analysis</CardDescription>
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
                          value={selectedReportFormat["financial"] || "pdf"}
                          onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, "financial": value }))}
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
                        onClick={() => handleGenerateReport("Financial")}
                        disabled={isGenerating["financial"]}
                      >
                        {isGenerating["financial"] ? "Generating..." : "Generate Report"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Analysis</CardTitle>
                    <CardDescription>Nutritional standards compliance and analysis</CardDescription>
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
                          value={selectedReportFormat["nutrition"] || "pdf"}
                          onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, "nutrition": value }))}
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
                        onClick={() => handleGenerateReport("Nutrition Analysis")}
                        disabled={isGenerating["nutrition"]}
                      >
                        {isGenerating["nutrition"] ? "Generating..." : "Generate Report"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>District Performance</CardTitle>
                    <CardDescription>Performance comparison across districts</CardDescription>
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
                          value={selectedReportFormat["performance"] || "pdf"}
                          onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, "performance": value }))}
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
                        onClick={() => handleGenerateReport("District Performance")}
                        disabled={isGenerating["performance"]}
                      >
                        {isGenerating["performance"] ? "Generating..." : "Generate Report"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Evaluation</CardTitle>
                    <CardDescription>Supplier performance and compliance report</CardDescription>
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
                          value={selectedReportFormat["supplier"] || "pdf"}
                          onValueChange={(value) => setSelectedReportFormat(prev => ({ ...prev, "supplier": value }))}
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
                        onClick={() => handleGenerateReport("Supplier Evaluation")}
                        disabled={isGenerating["supplier"]}
                      >
                        {isGenerating["supplier"] ? "Generating..." : "Generate Report"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
 
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>Previously generated reports and downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search reports..."
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
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="supplier">Supplier</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Status</TableHead> 
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.length > 0 ? (
                          paginatedReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.id}</TableCell>
                              <TableCell>{report.title}</TableCell>
                              <TableCell className="capitalize">{report.type}</TableCell>
                              <TableCell>{report.period}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {report.generatedDate}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(report.status)}</TableCell> 
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(report.id)}
                                  disabled={report.status !== "completed"}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No reports found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-sm">
                        Showing {filteredReports.length === 0 ? 0 : startIndex + 1}–
                        {Math.min(startIndex + pageSize, filteredReports.length)} of {filteredReports.length}
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
