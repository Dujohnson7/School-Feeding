
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Package,
  Users,
  DollarSign,
  Download,
  Search,
  TrendingUp,
  AlertCircle,
  School,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"
import { budgetService, BudgetDistrict, BudgetSchool } from "../government/service/budgetService"

export function DistrictBudget() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedSchool, setSelectedSchool] = useState("all")
  const [pageSchools, setPageSchools] = useState(1)
  const [pageSizeSchools, setPageSizeSchools] = useState(5)
  const [pageHist, setPageHist] = useState(1)
  const [pageSizeHist, setPageSizeHist] = useState(5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const [districtBudgetData, setDistrictBudgetData] = useState<BudgetDistrict[]>([])
  const [budgetSchools, setBudgetSchools] = useState<BudgetSchool[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDistrictBudgetData()
  }, [])

  const fetchDistrictBudgetData = async () => {
    const districtId = localStorage.getItem("districtId")
    if (!districtId) {
      toast.error("District ID not found")
      return
    }

    try {
      setLoading(true)
      const budgetGovData = await budgetService.getAllBudgetGovDistrict()
      // Note: We might want to store different things in different states
      // but let's see how they were used before.

      const budgetData = await budgetService.getBudgetDistrictsByDistrictId(districtId)
      setDistrictBudgetData(budgetData)

      const schoolsData = await budgetService.getBudgetSchoolsByDistrictId(districtId)
      setBudgetSchools(schoolsData)
    } catch (error) {
      console.error("Error fetching district budget data:", error)
      toast.error("Failed to load budget data")
    } finally {
      setLoading(false)
    }
  }

  // Calculate overview totals based on fetched data
  const currentBudget = districtBudgetData[0] || null
  const activeFiscalYear = currentBudget?.budgetGov?.fiscalYear || "N/A"

  const overview = {
    totalAllocated: districtBudgetData.reduce((acc, curr) => acc + curr.budget, 0),
    spent: districtBudgetData.reduce((acc, curr) => acc + curr.spentBudget, 0),
    remaining: districtBudgetData.reduce((acc, curr) => acc + (curr.budget - curr.spentBudget), 0),
    schools: budgetSchools.length,
    studentsServed: budgetSchools.reduce((acc, curr) => acc + (curr.school?.totalStudents || 0), 0),
  }

  const filteredSchools = budgetSchools.filter(
    (bs) =>
      bs.school?.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSchool === "all" || bs.school?.schoolName === selectedSchool),
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

  const totalPagesHist = Math.max(1, Math.ceil(districtBudgetData.length / pageSizeHist))
  const startHist = (pageHist - 1) * pageSizeHist
  // const paginatedHistory = districtBudgetData.slice(startHist, startHist + pageSizeHist) // If needed later
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

  // Placeholder for monthly spending since we don't have it in the API yet
  const monthlySpending: any[] = []

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">District Budget</h1>
          </div>
          <HeaderActions role="district" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          {/* Budget Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(overview.totalAllocated)}</div>
                <p className="text-xs text-muted-foreground">FY {activeFiscalYear}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(overview.spent)}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.totalAllocated > 0 ? ((overview.spent / overview.totalAllocated) * 100).toFixed(1) : 0}% utilized
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(overview.remaining)}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.totalAllocated > 0 ? ((overview.remaining / overview.totalAllocated) * 100).toFixed(1) : 0}% remaining
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.schools}</div>
                <p className="text-xs text-muted-foreground">With budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Served</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.studentsServed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Beneficiaries</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="schools" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="schools">School Allocations</TabsTrigger>
                <TabsTrigger value="spending">Monthly Spending</TabsTrigger>
                <TabsTrigger value="history">Budget Fiscal Year</TabsTrigger>
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
                    {filteredSchools.length > 0 ? paginatedSchools.map((bs) => (
                      <div key={bs.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{bs.school?.schoolName || "Unknown School"}</h3>
                            <Badge variant={bs.budgetStatus === "ON_TRACK" ? "default" : "destructive"}>
                              {bs.budgetStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{bs.school?.totalStudents || 0} students</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Allocated: {formatCurrency(bs.budget)}</span>
                            <span>Spent: {formatCurrency(bs.spentBudget)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">
                            {bs.budget > 0 ? ((bs.spentBudget / bs.budget) * 100).toFixed(1) : 0}% utilized
                          </div>
                          <Progress value={bs.budget > 0 ? (bs.spentBudget / bs.budget) * 100 : 0} className="w-[100px]" />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">
                        {loading ? "Loading school allocations..." : "No schools found."}
                      </div>
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
                  <CardTitle>Budget Fiscal Year</CardTitle>
                  <CardDescription>Budget allocations received from government</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districtBudgetData.length > 0 ? districtBudgetData.map((bd) => (
                      <div key={bd.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">FY {bd.budgetGov?.fiscalYear || "N/A"}</h3>
                            <Badge variant={bd.budgetGov?.eFiscalState === "ACTIVE" ? "default" : "secondary"}>
                              {bd.budgetGov?.eFiscalState || "N/A"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Received allocation from central government</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(bd.budget)}</div>
                          <div className="text-sm text-muted-foreground">Total Allocated</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">
                        {loading ? "Loading history..." : "No history found."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {districtBudgetData.length === 0 ? 0 : startHist + 1}–
                    {Math.min(startHist + pageSizeHist, districtBudgetData.length)} of {districtBudgetData.length}
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
      </div >
    </div >
  )
}
