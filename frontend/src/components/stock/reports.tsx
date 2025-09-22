
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Calendar,
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
  Warehouse,
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

export function StockReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState("all")

  const reports = [
    {
      id: "STRPT-2025-042",
      title: "Daily Stock Movement Report",
      type: "movement",
      category: "Stock Movement",
      period: "April 13, 2025",
      generatedDate: "2025-04-13",
      status: "completed",
      size: "1.2 MB",
      author: "Stock Manager",
    },
    {
      id: "STRPT-2025-041",
      title: "Weekly Inventory Summary",
      type: "inventory",
      category: "Inventory Management",
      period: "Week 15, 2025",
      generatedDate: "2025-04-12",
      status: "completed",
      size: "890 KB",
      author: "Inventory Officer",
    },
    {
      id: "STRPT-2025-040",
      title: "Receiving Report",
      type: "receiving",
      category: "Goods Receiving",
      period: "April 1-12, 2025",
      generatedDate: "2025-04-12",
      status: "processing",
      size: "1.5 MB",
      author: "Receiving Clerk",
    },
    {
      id: "STRPT-2025-039",
      title: "Distribution Analysis",
      type: "distribution",
      category: "Food Distribution",
      period: "March 2025",
      generatedDate: "2025-04-01",
      status: "completed",
      size: "750 KB",
      author: "Distribution Manager",
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
    { value: "movement", label: "Stock Movement", description: "Daily stock in/out movements and transactions" },
    { value: "inventory", label: "Inventory Management", description: "Current stock levels and inventory valuation" },
    { value: "receiving", label: "Goods Receiving", description: "Goods received from suppliers and quality checks" },
    { value: "distribution", label: "Food Distribution", description: "Food distribution to kitchen and consumption" },
    { value: "waste", label: "Waste & Loss Analysis", description: "Food waste, spoilage, and inventory losses" },
    { value: "fifo", label: "FIFO Compliance", description: "First-In-First-Out compliance and expiry management" },
  ]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">Stock Manager</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/stock-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/stock-inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Warehouse className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              to="/stock-receiving"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Receiving
            </Link>
            <Link
              to="/stock-distribution"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Distribution
            </Link>
            <Link
              to="/stock-reports"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/stock-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link href="#" className="lg:hidden">
            <FileText className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Stock Reports</h1>
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
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Stock Manager</p>
                    <p className="text-xs leading-none text-muted-foreground">stock@school.edu.rw</p>
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
                  <CardDescription>Previously generated stock management reports</CardDescription>
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
                            <SelectItem value="movement">Stock Movement</SelectItem>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="receiving">Receiving</SelectItem>
                            <SelectItem value="distribution">Distribution</SelectItem>
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
