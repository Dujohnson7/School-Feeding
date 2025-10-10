
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Calendar,
  Check,
  Download,
  FileText,
  Filter,
  Home,
  LogOut,
  Package,
  Search,
  Settings,
  Truck,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

export function DistrictReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState("all")

  const reports = [
    {
      id: "DRPT-2025-042",
      title: "Nyarugenge District Monthly Report",
      type: "monthly",
      category: "District Overview",
      period: "March 2025",
      generatedDate: "2025-04-01",
      status: "completed",
      size: "1.2 MB",
      author: "District Coordinator",
    },
    {
      id: "DRPT-2025-041",
      title: "School Performance Analysis",
      type: "performance",
      category: "Performance Analysis",
      period: "Q1 2025",
      generatedDate: "2025-03-31",
      status: "completed",
      size: "890 KB",
      author: "Education Officer",
    },
    {
      id: "DRPT-2025-040",
      title: "Supplier Delivery Report",
      type: "delivery",
      category: "Supply Chain",
      period: "March 2025",
      generatedDate: "2025-03-30",
      status: "processing",
      size: "1.5 MB",
      author: "Logistics Manager",
    },
    {
      id: "DRPT-2025-039",
      title: "Budget Utilization Summary",
      type: "financial",
      category: "Financial Analysis",
      period: "Q1 2025",
      generatedDate: "2025-03-29",
      status: "completed",
      size: "750 KB",
      author: "Finance Officer",
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

  const handleGenerateReport = (type: string, category: string) => {
    console.log(`Generating ${type} report for ${category}`)
    alert(`${type} report generation started. You will be notified when it's ready.`)
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
    { value: "district", label: "District Overview", description: "Comprehensive district performance summary" },
    { value: "schools", label: "School Performance", description: "Individual school analysis and metrics" },
    { value: "suppliers", label: "Supply Chain", description: "Supplier performance and delivery tracking" },
    { value: "financial", label: "Financial Analysis", description: "Budget utilization and cost analysis" },
    { value: "nutrition", label: "Nutrition Compliance", description: "Nutritional standards and health metrics" },
    { value: "attendance", label: "Student Attendance", description: "Attendance patterns and meal participation" },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <FileText className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">District Reports</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">District Coordinator</p>
                    <p className="text-xs leading-none text-muted-foreground">coordinator@district.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
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
                          <Select defaultValue="pdf">
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
                        <Button className="w-full" onClick={() => handleGenerateReport(category.value, category.label)}>
                          Generate Report
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
                  <CardDescription>Previously generated district reports</CardDescription>
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
                            <SelectItem value="monthly">District Overview</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="delivery">Supply Chain</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
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
                          filteredReports.map((report) => (
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
