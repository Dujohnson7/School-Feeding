
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Download, Home, PieChart, TrendingUp, User, School } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { toast } from "sonner"
import { districtService } from "./service/districtService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface SchoolParticipation {
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

interface SchoolPerformance {
  schoolName: string
  enrollment: number
  participation: number
  onTimeDelivery: number
}

interface BudgetAllocation {
  category: string
  amount: string
  percentage: number
}

export function DistrictAnalytics() {
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsStats>({
    totalSchools: 0,
    studentsFed: 0,
    deliverySuccessRate: 0,
    budgetUtilization: 0,
  })
  const [schoolParticipation, setSchoolParticipation] = useState<SchoolParticipation[]>([])
  const [deliveryPerformance, setDeliveryPerformance] = useState<DeliveryPerformance[]>([])
  const [nutritionCompliance, setNutritionCompliance] = useState<NutritionCompliance[]>([])
  const [schoolPerformance, setSchoolPerformance] = useState<SchoolPerformance[]>([])
  const [budgetAllocation, setBudgetAllocation] = useState<BudgetAllocation[]>([])

  useEffect(() => {
    fetchAnalyticsData()
  }, [period])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const districtId = localStorage.getItem("districtId")

      if (!districtId) {
        toast.error("District ID not found. Please login again.")
        setLoading(false)
        return
      }

      // Fetch analytics statistics
      const statsData = await districtService.getAnalyticsStats(districtId, period)
      if (statsData) setStats(statsData)

      // Fetch school participation
      const participationData = await districtService.getSchoolParticipation(districtId, period)
      if (participationData) setSchoolParticipation(participationData)

      // Fetch delivery performance
      const deliveryData = await districtService.getDeliveryPerformance(districtId, period)
      if (deliveryData) setDeliveryPerformance(deliveryData)

      // Fetch nutrition compliance
      const nutritionData = await districtService.getNutritionCompliance(districtId, period)
      if (nutritionData) setNutritionCompliance(nutritionData)

      // Fetch school performance
      const schoolPerformanceData = await districtService.getSchoolPerformance(districtId, period)
      if (schoolPerformanceData) setSchoolPerformance(schoolPerformanceData)

      // Fetch budget allocation
      const budgetData = await districtService.getBudgetAllocation(districtId, period)
      if (budgetData) setBudgetAllocation(budgetData)
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
        <PageHeader
          title="District Analytics"
          homeTo="/district-dashboard"
          HomeIcon={BarChart3}
          profileTo="/district-profile"
          userName="District Coordinator"
          userEmail="coordinator@district.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="DC"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">District Analytics Dashboard</h2>
              <p className="text-muted-foreground">Comprehensive data analysis and visualization for your district</p>
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
                    <School className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.totalSchools}</div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "In district"}
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
                      {loading ? "Loading..." : "On-time deliveries"}
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
                    <CardTitle>School Participation</CardTitle>
                    <CardDescription>Participation rate by school type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && schoolParticipation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : schoolParticipation.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        schoolParticipation.map((school) => (
                          <div key={school.name}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{school.name}</span>
                              <span className="text-sm font-medium">{school.percent}% participation</span>
                            </div>
                            <Progress value={school.percent} className="h-2" />
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
                    <CardDescription>Adherence to nutrition guidelines</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading && nutritionCompliance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : nutritionCompliance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        nutritionCompliance.map((n) => (
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
                      {loading && schoolPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : schoolPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        schoolPerformance.map((school) => (
                          <div key={school.schoolName}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{school.schoolName}</span>
                              <span className="text-sm font-medium">
                                {school.participation}% participation ({school.enrollment} enrolled)
                              </span>
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
                    <CardDescription>Key performance indicators by school</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-6">
                      {loading && schoolPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : schoolPerformance.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        schoolPerformance.map((school) => (
                          <div key={school.schoolName}>
                            <h4 className="text-sm font-medium mb-2">{school.schoolName}</h4>
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
                    <CardDescription>Distribution of district budget across categories</CardDescription>
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
                    <CardTitle>Budget Utilization Summary</CardTitle>
                    <CardDescription>Overall budget usage and remaining balance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {stats.budgetUtilization}%
                              </div>
                              <div className="text-xs text-muted-foreground">Overall Utilization</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {stats.budgetUtilization > 0 ? "Active" : "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">Status</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Progress value={stats.budgetUtilization} className="h-4" />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>Used</span>
                              <span>Remaining</span>
                            </div>
                          </div>
                        </>
                      )}
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

export default DistrictAnalytics

