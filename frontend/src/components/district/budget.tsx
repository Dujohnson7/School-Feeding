
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Home,
  LogOut,
  Package,
  Settings,
  User,
  FileText,
  Users,
  DollarSign,
  Download,
  Search,
  TrendingUp,
  AlertCircle,
  School,
  Truck,
  Check,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function DistrictBudget() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedSchool, setSelectedSchool] = useState("all")
  const [pageSchools, setPageSchools] = useState(1)
  const [pageSizeSchools, setPageSizeSchools] = useState(5)
  const [pageHist, setPageHist] = useState(1)
  const [pageSizeHist, setPageSizeHist] = useState(5)

  // Mock budget data for Nyarugenge District
  const districtBudget = {
    totalAllocated: 3200000000, // 3.2 billion RWF
    spent: 2800000000, // 2.8 billion RWF
    remaining: 400000000, // 400 million RWF
    schools: 89,
    studentsServed: 45600,
  }

  const schoolAllocations = [
    {
      id: 1,
      school: "Kigali Primary School",
      allocated: 180000000,
      spent: 165000000,
      students: 850,
      status: "On Track",
    },
    {
      id: 2,
      school: "Nyamirambo Secondary School",
      allocated: 220000000,
      spent: 195000000,
      students: 1200,
      status: "On Track",
    },
    { id: 3, school: "Remera High School", allocated: 160000000, spent: 140000000, students: 750, status: "On Track" },
    { id: 4, school: "Gasabo Elementary", allocated: 140000000, spent: 125000000, students: 680, status: "On Track" },
    { id: 5, school: "Kimisagara Primary", allocated: 120000000, spent: 110000000, students: 580, status: "On Track" },
    { id: 6, school: "Nyakabanda Secondary", allocated: 200000000, spent: 170000000, students: 950, status: "At Risk" },
    { id: 7, school: "Muhima Primary", allocated: 100000000, spent: 85000000, students: 480, status: "On Track" },
    { id: 8, school: "Biryogo Elementary", allocated: 90000000, spent: 80000000, students: 420, status: "On Track" },
  ]

  const budgetHistory = [
    { id: 1, year: "2025", allocated: 3200000000, received: "2024-12-15", status: "Active" },
    { id: 2, year: "2024", allocated: 2900000000, received: "2023-12-10", status: "Completed" },
    { id: 3, year: "2023", allocated: 2600000000, received: "2022-12-08", status: "Completed" },
    { id: 4, year: "2022", allocated: 2400000000, received: "2021-12-12", status: "Completed" },
  ]

  const monthlySpending = [
    { month: "Jan", budgeted: 266666667, actual: 245000000 },
    { month: "Feb", budgeted: 266666667, actual: 258000000 },
    { month: "Mar", budgeted: 266666667, actual: 272000000 },
    { month: "Apr", budgeted: 266666667, actual: 251000000 },
    { month: "May", budgeted: 266666667, actual: 264000000 },
    { month: "Jun", budgeted: 266666667, actual: 248000000 },
    { month: "Jul", budgeted: 266666667, actual: 269000000 },
    { month: "Aug", budgeted: 266666667, actual: 255000000 },
    { month: "Sep", budgeted: 266666667, actual: 261000000 },
    { month: "Oct", budgeted: 266666667, actual: 267000000 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredSchools = schoolAllocations.filter(
    (school) =>
      school.school.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSchool === "all" || school.school === selectedSchool),
  )

  useEffect(() => {
    setPageSchools(1)
  }, [searchTerm, selectedSchool])

  const totalPagesSchools = Math.max(1, Math.ceil(filteredSchools.length / pageSizeSchools))
  const startSchools = (pageSchools - 1) * pageSizeSchools
  const paginatedSchools = filteredSchools.slice(startSchools, startSchools + pageSizeSchools)
  const canPrevSchools = pageSchools > 1
  const canNextSchools = pageSchools < totalPagesSchools
  const getSchoolsPageWindow = () => {
    const maxButtons = 5
    if (totalPagesSchools <= maxButtons) return Array.from({ length: totalPagesSchools }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, pageSchools - half)
    let end = Math.min(totalPagesSchools, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const totalPagesHist = Math.max(1, Math.ceil(budgetHistory.length / pageSizeHist))
  const startHist = (pageHist - 1) * pageSizeHist
  const paginatedHistory = budgetHistory.slice(startHist, startHist + pageSizeHist)
  const canPrevHist = pageHist > 1
  const canNextHist = pageHist < totalPagesHist
  const getHistPageWindow = () => {
    const maxButtons = 5
    if (totalPagesHist <= maxButtons) return Array.from({ length: totalPagesHist }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, pageHist - half)
    let end = Math.min(totalPagesHist, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">District Budget - Nyarugenge</h1>
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
                    <p className="text-xs leading-none text-muted-foreground">coordinator@nyarugenge.rw</p>
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
          {/* Budget Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(districtBudget.totalAllocated)}</div>
                <p className="text-xs text-muted-foreground">FY 2025</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(districtBudget.spent)}</div>
                <p className="text-xs text-muted-foreground">87.5% utilized</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(districtBudget.remaining)}</div>
                <p className="text-xs text-muted-foreground">12.5% remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{districtBudget.schools}</div>
                <p className="text-xs text-muted-foreground">In district</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Served</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{districtBudget.studentsServed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Daily meals</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="schools" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="schools">School Allocations</TabsTrigger>
                <TabsTrigger value="spending">Monthly Spending</TabsTrigger>
                <TabsTrigger value="history">Budget History</TabsTrigger>
              </TabsList>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            <TabsContent value="schools" className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Schools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {schoolAllocations.map((school) => (
                      <SelectItem key={school.id} value={school.school}>
                        {school.school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* School Allocations */}
              <Card>
                <CardHeader>
                  <CardTitle>School Budget Allocations</CardTitle>
                  <CardDescription>Budget allocation and spending by school in Nyarugenge District</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSchools.length > 0 ? paginatedSchools.map((school) => (
                      <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{school.school}</h3>
                            <Badge variant={school.status === "On Track" ? "default" : "destructive"}>
                              {school.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{school.students} students</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Allocated: {formatCurrency(school.allocated)}</span>
                            <span>Spent: {formatCurrency(school.spent)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">
                            {((school.spent / school.allocated) * 100).toFixed(1)}% utilized
                          </div>
                          <Progress value={(school.spent / school.allocated) * 100} className="w-[100px]" />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">No schools found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredSchools.length === 0 ? 0 : startSchools + 1}–
                    {Math.min(startSchools + pageSizeSchools, filteredSchools.length)} of {filteredSchools.length}
                  </span>
                  <Select value={String(pageSizeSchools)} onValueChange={(v) => { setPageSizeSchools(Number(v)); setPageSchools(1) }}>
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
                        onClick={(e) => { e.preventDefault(); if (canPrevSchools) setPageSchools((p) => p - 1) }}
                        className={!canPrevSchools ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getSchoolsPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === pageSchools}
                          onClick={(e) => { e.preventDefault(); setPageSchools(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNextSchools) setPageSchools((p) => p + 1) }}
                        className={!canNextSchools ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            <TabsContent value="spending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending Analysis</CardTitle>
                  <CardDescription>Comparison of budgeted vs actual spending by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlySpending.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">{month.month} 2025</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Budgeted: {formatCurrency(month.budgeted)}</span>
                            <span>Actual: {formatCurrency(month.actual)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">
                            {((month.actual / month.budgeted) * 100).toFixed(1)}% of budget
                          </div>
                          <Progress value={(month.actual / month.budgeted) * 100} className="w-[100px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Budget History</CardTitle>
                  <CardDescription>Historical budget allocations received from government</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetHistory.length > 0 ? paginatedHistory.map((budget) => (
                      <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">FY {budget.year}</h3>
                            <Badge variant={budget.status === "Active" ? "default" : "secondary"}>
                              {budget.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Received on {budget.received}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(budget.allocated)}</div>
                          <div className="text-sm text-muted-foreground">Total Allocated</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">No history found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {budgetHistory.length === 0 ? 0 : startHist + 1}–
                    {Math.min(startHist + pageSizeHist, budgetHistory.length)} of {budgetHistory.length}
                  </span>
                  <Select value={String(pageSizeHist)} onValueChange={(v) => { setPageSizeHist(Number(v)); setPageHist(1) }}>
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
                        onClick={(e) => { e.preventDefault(); if (canPrevHist) setPageHist((p) => p - 1) }}
                        className={!canPrevHist ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getHistPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === pageHist}
                          onClick={(e) => { e.preventDefault(); setPageHist(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNextHist) setPageHist((p) => p + 1) }}
                        className={!canNextHist ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
