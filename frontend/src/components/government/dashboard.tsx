
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Building2, DollarSign, Home, MapPinCheck, Users, FileText } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { governmentService } from "./service/governmentService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface GovStats {
  totalSchools: string
  studentsFedDaily: string
  districtsCovered: string
  programBudget: string
}

interface DistrictData {
  district: string
  totalSchools: number
  totalStudents: number
  performance: number
}

interface NationalOverview {
  name: string
  value: number
}

interface MonthlyFoodDistribution {
  month: string
  tons: number
}

interface KPI {
  name: string
  value: number
}

interface TopDistrict {
  name: string
  meta: string
  status: string
}

interface SystemStats {
  suppliers: number
  districtCoordinators: number
  stockkeepers: number
  schoolCoordinators: number
  schools: number
  items: number
}

export function GovDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<GovStats>({
    totalSchools: "0",
    studentsFedDaily: "0",
    districtsCovered: "0",
    programBudget: "RWF 0",
  })
  const [districts, setDistricts] = useState<DistrictData[]>([])
  const [nationalOverview, setNationalOverview] = useState<NationalOverview[]>([])
  const [monthlyFoodDistribution, setMonthlyFoodDistribution] = useState<MonthlyFoodDistribution[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [topDistricts, setTopDistricts] = useState<TopDistrict[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats>({
    suppliers: 0,
    districtCoordinators: 0,
    stockkeepers: 0,
    schoolCoordinators: 0,
    schools: 0,
    items: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch basic stats
      const [totalSchools, totalStudents, totalDistricts, currentBudget] = await Promise.all([
        governmentService.getTotalSchool(),
        governmentService.getTotalStudent(),
        governmentService.getTotalDistricts(),
        governmentService.getCurrentBudget()
      ])

      setStats({
        totalSchools: totalSchools?.toString() || "0",
        studentsFedDaily: totalStudents?.toLocaleString() || "0",
        districtsCovered: totalDistricts?.toString() || "0",
        programBudget: currentBudget ? `RWF ${currentBudget.toLocaleString()}` : "RWF 0",
      })

      // Fetch KPIs
      const [nutritionRate, onTimeRate, supplierRate, budgetRate] = await Promise.all([
        governmentService.getNutritionComplianceRate(),
        governmentService.getOnTimeDeliveryRate(),
        governmentService.getSupplierPerformanceRate(),
        governmentService.getBudgetParticipationRate()
      ])

      setKpis([
        { name: "Nutrition Compliance", value: Number(nutritionRate?.toFixed(2)) || 0 },
        { name: "On-time Delivery", value: Number(onTimeRate?.toFixed(2)) || 0 },
        { name: "Supplier Performance", value: Number(supplierRate?.toFixed(2)) || 0 },
        { name: "Budget Utilization", value: Number(budgetRate?.toFixed(2)) || 0 }
      ])

      // Fetch Province Performance (National Overview)
      const provincePerformance = await governmentService.getProvincePerformance()
      if (provincePerformance && Array.isArray(provincePerformance)) {
        setNationalOverview(provincePerformance.map((item: any) => ({
          name: item[0], // Province name
          value: parseFloat(item[1]) || 0 // Performance value (handle string % if needed)
        })))
      }

      // Fetch Monthly Distribution
      const distributionData = await governmentService.getMonthlyFoodDistributionNew()
      if (distributionData && Array.isArray(distributionData)) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        setMonthlyFoodDistribution(distributionData.map((item: any) => ({
          month: monthNames[parseInt(item[0]) - 1] || item[0], // Convert number to name
          tons: item[1] || 0
        })))
      }

      // Fetch District Performance
      const districtsData = await governmentService.getDistrictPerformanceDetails()
      if (districtsData) setDistricts(districtsData)

      // Fetch Top Performing Districts (from national district budget performance)
      const topDistData = await governmentService.getNationalDistrictBudgetPerformance()
      if (topDistData && Array.isArray(topDistData)) {
        setTopDistricts(topDistData.slice(0, 5).map((item: any) => ({
          name: item[0],
          meta: `Budget utilization: ${item[1] || "0%"}`,
          status: item[2] || "Good"
        })))
      }

      // Fetch System Stats (Users and Items)
      const [allUsers, allItems, allSchools] = await Promise.all([
        governmentService.getAllUsers(),
        governmentService.getAllItems(),
        governmentService.getAllSchools()
      ])

      if (allUsers && Array.isArray(allUsers)) {
        setSystemStats(prev => ({
          ...prev,
          suppliers: allUsers.filter((u: any) => u.role === "SUPPLIER").length,
          districtCoordinators: allUsers.filter((u: any) => u.role === "DISTRICT").length,
          stockkeepers: allUsers.filter((u: any) => u.role === "STOCK_KEEPER").length,
        }))
      }

      if (allUsers && Array.isArray(allUsers)) {
        setSystemStats(prev => ({
          ...prev,
          schoolCoordinators: allUsers.filter((u: any) => u.role === "SCHOOL").length,
          schools: allUsers.filter((u: any) => u.role === "SCHOOL").length,
        }))
      }

      if (allSchools && Array.isArray(allSchools)) {
        setSystemStats(prev => ({ ...prev, schools: allSchools.length }))
      }

      if (allItems && Array.isArray(allItems)) {
        setSystemStats(prev => ({ ...prev, items: allItems.length }))
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const statsConfig = [
    {
      title: "Total Schools",
      key: "totalSchools" as keyof GovStats,
      icon: Building2,
    },
    {
      title: "Students Fed Daily",
      key: "studentsFedDaily" as keyof GovStats,
      icon: Users,
    },
    {
      title: "Districts Covered",
      key: "districtsCovered" as keyof GovStats,
      icon: MapPinCheck,
    },
    {
      title: "Program Budget",
      key: "programBudget" as keyof GovStats,
      icon: DollarSign,
    },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <PageHeader
          title="Government Dashboard"
          homeTo="/gov-dashboard"
          HomeIcon={Home}
          profileTo="/gov-profile"
          userName="Government Official"
          userEmail="official@mineduc.gov.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="GV"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsConfig.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats[stat.key]}</div>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading..." : "Current period"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* National Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>National Overview</CardTitle>
                  <CardDescription>School feeding program performance across Rwanda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-4">
                      {loading && nationalOverview.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : nationalOverview.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      ) : (
                        nationalOverview.map((p) => (
                          <div key={p.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none">{p.name}</p>
                              <span className="text-xs text-muted-foreground">{p.value}%</span>
                            </div>
                            <Progress value={p.value} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>

                    {/* Monthly Food Distribution */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">Monthly Food Distribution </p>
                      <div className="mt-4 h-[120px] w-full bg-muted/50 rounded p-2">
                        <div className="flex h-full items-end justify-between gap-2"> 
                          {loading && monthlyFoodDistribution.length === 0 ? (
                            <div className="text-sm text-muted-foreground w-full text-center self-center">Loading...</div>
                          ) : monthlyFoodDistribution.length === 0 ? (
                            <div className="text-sm text-muted-foreground w-full text-center self-center">No data available</div>
                          ) : (
                            monthlyFoodDistribution.map((m) => {
                              const maxTons = Math.max(...monthlyFoodDistribution.map(d => d.tons), 100)
                              // Ensure at least 5% height if value > 0, otherwise 0
                              const h = m.tons > 0 ? Math.max(5, (m.tons / maxTons) * 100) : 0

                              return (
                                <div key={m.month} className="flex flex-1 flex-col items-center gap-1 group relative h-full justify-end">
                                  <div
                                    className="w-full rounded-t-sm bg-primary transition-all hover:bg-primary/80 relative"
                                    style={{ height: `${h}%` }}
                                  >
                                    {m.tons > 0 && (
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-background border px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm">
                                        {m.tons}t
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground truncate w-full text-center" title={m.month}>{m.month}</span>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Performance Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>National program metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading && kpis.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : kpis.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    ) : (
                      kpis.map((k) => (
                        <div key={k.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{k.name}</p>
                            <span className="text-xs text-muted-foreground">{k.value}%</span>
                          </div>
                          <Progress value={k.value} className="h-2" />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Performing Districts */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Districts</CardTitle>
                  <CardDescription>Districts with highest efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading && topDistricts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : topDistricts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    ) : (
                      topDistricts.map((d) => (
                        <div key={d.name} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <p className="text-sm font-medium leading-none">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{d.meta}</p>
                          </div>
                          <Badge variant="default">{d.status}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* System Overview (New Card as requested) */}
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Key system user and item counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">Suppliers</span>
                        <span className="text-2xl font-bold">{systemStats.suppliers}</span>
                      </div>
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">District Coordinators</span>
                        <span className="text-2xl font-bold">{systemStats.districtCoordinators}</span>
                      </div>
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">Stockkeepers</span>
                        <span className="text-2xl font-bold">{systemStats.stockkeepers}</span>
                      </div>
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">School Coordinators</span>
                        <span className="text-2xl font-bold">{systemStats.schoolCoordinators}</span>
                      </div>
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">Schools</span>
                        <span className="text-2xl font-bold">{systemStats.schools}</span>
                      </div>
                      <div className="flex flex-col space-y-1 rounded-md border p-3">
                        <span className="text-xs text-muted-foreground">Items</span>
                        <span className="text-2xl font-bold">{systemStats.items}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* District Performance & Recent Activities */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>District Performance</CardTitle>
                  <CardDescription>Coverage and budget utilization by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading && districts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : districts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    ) : (
                      districts.map((district, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{district.district}</p>
                              <p className="text-xs text-muted-foreground">
                                {district.totalSchools} schools • {district.totalStudents.toLocaleString()} students
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={district.performance >= 95 ? "default" : "secondary"}>
                                {district.performance.toFixed(2)}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={district.performance} className="h-2" />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GovDashboard
