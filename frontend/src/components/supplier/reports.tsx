
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Download, FileText, Filter, Search } from "lucide-react"
import { toast } from "sonner"
import { generateSupplierReport } from "@/utils/export-utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function SupplierReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selectedReportFormat, setSelectedReportFormat] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})

  const reports = [
    {
      id: "SRPT-2025-042",
      title: "Monthly Delivery Report",
      type: "delivery",
      category: "Delivery Performance",
      period: "March 2025",
      generatedDate: "2025-04-01",
      status: "completed",
      size: "1.2 MB",
      author: "Logistics Manager",
    },
    {
      id: "SRPT-2025-041",
      title: "Revenue Summary",
      type: "financial",
      category: "Financial Analysis",
      period: "Q1 2025",
      generatedDate: "2025-03-31",
      status: "completed",
      size: "890 KB",
      author: "Finance Team",
    },
    {
      id: "SRPT-2025-040",
      title: "Performance Analysis",
      type: "performance",
      category: "Performance Metrics",
      period: "March 2025",
      generatedDate: "2025-03-30",
      status: "processing",
      size: "1.5 MB",
      author: "Operations Manager",
    },
    {
      id: "SRPT-2025-039",
      title: "Customer Satisfaction Report",
      type: "satisfaction",
      category: "Customer Relations",
      period: "Q1 2025",
      generatedDate: "2025-03-29",
      status: "completed",
      size: "750 KB",
      author: "Customer Service",
    },
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = reportType === "all" || report.type === reportType
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    let matchesDate = true
    if (dateRange?.from && dateRange?.to) {
      const reportDate = new Date(report.generatedDate)
      matchesDate = reportDate >= dateRange.from && reportDate <= dateRange.to
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, reportType, statusFilter, dateRange])

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

  const handleGenerateReport = async (type: string, category: string) => {
    try {
      setIsGenerating(prev => ({ ...prev, [type]: true }))
      const format = (selectedReportFormat[type] || 'pdf') as 'pdf' | 'csv' | 'excel'
      
      // Sample data - in real app, fetch from API based on type and dateRange
      const sampleData = [
        { 'Supplier': 'ABC Foods Ltd', 'Deliveries': 15, 'Total Amount': 500000, 'Status': 'Active' },
        { 'Supplier': 'XYZ Distributors', 'Deliveries': 12, 'Total Amount': 350000, 'Status': 'Active' },
        { 'Supplier': 'Fresh Produce Co', 'Deliveries': 8, 'Total Amount': 200000, 'Status': 'Inactive' }
      ]
      
      await generateSupplierReport(
        category,
        { from: dateRange?.from, to: dateRange?.to },
        format,
        sampleData
      )
      
      toast.success(`${category} report generated successfully`)
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

  const reportCategories = [
    { value: "delivery", label: "Delivery Performance", description: "Delivery timeliness and efficiency metrics" },
    { value: "financial", label: "Financial Analysis", description: "Revenue, costs, and profitability reports" },
    { value: "inventory", label: "Inventory Management", description: "Stock levels and inventory turnover" },
    { value: "quality", label: "Quality Assurance", description: "Product quality and compliance reports" },
    { value: "customer", label: "Customer Relations", description: "Customer satisfaction and feedback" },
    { value: "operations", label: "Operations Overview", description: "Comprehensive operational performance" },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/supplier-dashboard" className="lg:hidden">
            <FileText className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Supplier Reports</h1>
          </div>
          <HeaderActions role="supplier" />
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
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>Previously generated supplier reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search reports by title, ID, or category..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm">Category:</label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="satisfaction">Customer Relations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm">Status:</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm">Date Range:</label>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.length > 0 ? (
                          paginatedReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.id}</TableCell>
                              <TableCell>{report.title}</TableCell>
                              <TableCell>{report.category}</TableCell>
                              <TableCell>{report.period}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {new Date(report.generatedDate).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{report.author}</TableCell>
                              <TableCell>{getStatusBadge(report.status)}</TableCell>
                              <TableCell>{report.size}</TableCell>
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
                            <TableCell colSpan={9} className="h-24 text-center">
                              No reports found matching your criteria.
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
