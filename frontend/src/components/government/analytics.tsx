
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Download, Home, PieChart, TrendingUp, User } from "lucide-react"
import { governmentService } from "./service/governmentService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface AnalyticsStats {
  totalSchools: number
  studentsFed: number
  deliverySuccessRate: number
  budgetUtilization: number
}

interface RegionParticipation {
  name: string
  percent: number
}

interface DeliveryPerformance {
  name: string
  percent: number
}

interface NutritionCompliance {
  name: string
  percent: number
}

interface SchoolEnrollment {
  name: string
  participation: number
}

interface SchoolPerformanceMetrics {
  schoolType: string
  onTimeDelivery: number
}

interface BudgetAllocation {
  category: string
  amount: string
  percentage: number
}

interface BudgetUtilization {
  province: string
  percentage: number
}

export function GovAnalytics() {
  const [period, setPeriod] = useState("month")
  const [district, setDistrict] = useState("all")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsStats>({
    totalSchools: 0,
    studentsFed: 0,
    deliverySuccessRate: 0,
    budgetUtilization: 0,
  })
  const [regionParticipation, setRegionParticipation] = useState<RegionParticipation[]>([])
  const [deliveryPerformance, setDeliveryPerformance] = useState<DeliveryPerformance[]>([])
  const [nutritionComplianceReqs, setNutritionComplianceReqs] = useState<NutritionCompliance[]>([])
  const [schoolEnrollment, setSchoolEnrollment] = useState<SchoolEnrollment[]>([])
  const [schoolPerformanceMetrics, setSchoolPerformanceMetrics] = useState<SchoolPerformanceMetrics[]>([])
  const [budgetAllocation, setBudgetAllocation] = useState<BudgetAllocation[]>([])
  const [budgetUtilization, setBudgetUtilization] = useState<BudgetUtilization[]>([])
  const [overallBudgetUtilization, setOverallBudgetUtilization] = useState(0)
  const [totalSpent, setTotalSpent] = useState("RWF 0")

  useEffect(() => {
    fetchAnalyticsData()
  }, [period, district])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Fetch analytics statistics
      const statsData = await governmentService.getAnalyticsStats(period, district)
      if (statsData) setStats(statsData)

      // Fetch region participation
      const participationData = await governmentService.getRegionParticipation(period, district)
      if (participationData) setRegionParticipation(participationData)

      // Fetch delivery performance
      const deliveryData = await governmentService.getDeliveryPerformanceAnalytics(period, district)
      if (deliveryData) setDeliveryPerformance(deliveryData)

      // Fetch nutrition compliance
      const nutritionData = await governmentService.getNutritionCompliance(period, district)
      if (nutritionData) setNutritionComplianceReqs(nutritionData)

      // Fetch school enrollment
      const enrollmentData = await governmentService.getSchoolEnrollment(period, district)
      if (enrollmentData) setSchoolEnrollment(enrollmentData)

      // Fetch school performance metrics
      const performanceData = await governmentService.getSchoolPerformance(period, district)
      if (performanceData) setSchoolPerformanceMetrics(performanceData)

      // Fetch budget allocation
      const budgetAllocData = await governmentService.getBudgetAllocation(period, district)
      if (budgetAllocData) setBudgetAllocation(budgetAllocData)

      // Fetch budget utilization
      const budgetUtilData = await governmentService.getBudgetUtilization(period, district)
      if (budgetUtilData) {
        if (budgetUtilData.overallUtilization) {
          setOverallBudgetUtilization(budgetUtilData.overallUtilization)
        }
        if (budgetUtilData.totalSpent) {
          setTotalSpent(budgetUtilData.totalSpent)
        }
        if (budgetUtilData.provinces) {
          setBudgetUtilization(budgetUtilData.provinces)
        }
      }
    } catch (error: any) {
      console.error("Error fetching analytics data:", error)
      toast.error("Failed to load analytics data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: string) => {
    // In a real app, this would generate and download a report
    console.log(`Exporting data in ${format} format`)
    toast.info(`Data would be exported as ${format.toUpperCase()} in a real application`)
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <BarChart3 className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">School Feeding Program Analytics</h2>
              <p className="text-muted-foreground">Comprehensive data analysis and visualization</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={setPeriod}>
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
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="kigali">Kigali</SelectItem>
                  <SelectItem value="eastern">Eastern</SelectItem>
                  <SelectItem value="northern">Northern</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                  <SelectItem value="southern">Southern</SelectItem>
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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schools">Schools</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.totalSchools}</div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "Current period"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Students Fed</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.studentsFed.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "Current period"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivery Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : `${stats.deliverySuccessRate}%`}</div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "Current period"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : `${stats.budgetUtilization}%`}</div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "Current period"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Schools Covered by Region</CardTitle>
                    <CardDescription>Distribution of schools in the feeding program</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && regionParticipation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : regionParticipation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        regionParticipation.map((r) => (
                          <div key={r.name}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{r.name}</span>
                              <span className="text-sm font-medium">{r.percent}% participation</span>
                            </div>
                            <Progress value={r.percent} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Performance</CardTitle>
                    <CardDescription>On-time vs delayed deliveries</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-6">
                      {loading && deliveryPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : deliveryPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        deliveryPerformance.map((d) => (
                          <div key={d.name}>
                            <div className="flex justify-between text-xs">
                              <span>{d.name}</span>
                              <span>{d.percent}%</span>
                            </div>
                            <Progress value={d.percent} className="h-3" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Nutrition Compliance</CardTitle>
                    <CardDescription>Adherence to national nutrition guidelines</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && nutritionComplianceReqs.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : nutritionComplianceReqs.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        nutritionComplianceReqs.map((n) => (
                          <div key={n.name}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{n.name}</span>
                              <span className="text-sm">{n.percent}%</span>
                            </div>
                            <Progress value={n.percent} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schools">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>School Enrollment vs Participation</CardTitle>
                    <CardDescription>
                      Comparison of enrolled students vs those participating in feeding program
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && schoolEnrollment.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : schoolEnrollment.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        schoolEnrollment.map((school) => (
                          <div key={school.name}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{school.name}</span>
                              <span className="text-sm font-medium">{school.participation}% participation</span>
                            </div>
                            <Progress value={school.participation} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>School Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators by school type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-6">
                      {loading && schoolPerformanceMetrics.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : schoolPerformanceMetrics.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        schoolPerformanceMetrics.map((school) => (
                          <div key={school.schoolType}>
                            <h4 className="text-sm font-medium mb-2">{school.schoolType}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>On-time delivery</span>
                                <span>{school.onTimeDelivery}%</span>
                              </div>
                              <Progress value={school.onTimeDelivery} className="h-3" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            <TabsContent value="budget">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Allocation by Category</CardTitle>
                    <CardDescription>Distribution of program budget across categories</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && budgetAllocation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : budgetAllocation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        budgetAllocation.map((budget) => (
                          <div key={budget.category}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{budget.category}</span>
                              <span className="text-sm">
                                {budget.amount} ({budget.percentage}%)
                              </span>
                            </div>
                            <Progress value={budget.percentage} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Utilization by Province</CardTitle>
                    <CardDescription>Budget usage across different provinces</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {loading ? "..." : `${overallBudgetUtilization}%`}
                          </div>
                          <div className="text-xs text-muted-foreground">Overall Utilization</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {loading ? "..." : totalSpent}
                          </div>
                          <div className="text-xs text-muted-foreground">Spent to Date</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {loading && budgetUtilization.length === 0 ? (
                          <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : budgetUtilization.length === 0 ? (
                          <div className="text-sm text-muted-foreground">No data available</div>
                        ) : (
                          budgetUtilization.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{item.province}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={item.percentage} className="h-2 w-20" />
                                <span className="text-xs">{item.percentage}%</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
