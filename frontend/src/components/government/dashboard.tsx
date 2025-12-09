
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Building2, DollarSign, Home, MapPinCheck, Users, FileText } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface GovStats {
  totalSchools: string
  studentsFedDaily: string
  districtsCovered: string
  programBudget: string
}

interface DistrictData {
  name: string
  schools: number
  students: number
  coverage: number
  budget: number
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

interface Alert {
  title: string
  desc: string
  severity: "High" | "Medium" | "Info"
}

interface TopDistrict {
  name: string
  meta: string
  status: string
}

interface Milestone {
  title: string
  date: string
  days: number
}

interface RecentActivity {
  id: number
  action: string
  timestamp: string
  type: string
}

export function GovDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
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
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [topDistricts, setTopDistricts] = useState<TopDistrict[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch dashboard statistics
      const statsResponse = await apiClient.get(`/government/dashboard/stats?period=${selectedPeriod}`)
      if (statsResponse.data) {
        setStats(statsResponse.data)
      }

      // Fetch district performance
      const districtsResponse = await apiClient.get(`/government/dashboard/districts?period=${selectedPeriod}`)
      if (districtsResponse.data) {
        setDistricts(districtsResponse.data)
      }

      // Fetch national overview
      const overviewResponse = await apiClient.get(`/government/dashboard/national-overview?period=${selectedPeriod}`)
      if (overviewResponse.data) {
        setNationalOverview(overviewResponse.data)
      }

      // Fetch monthly food distribution
      const distributionResponse = await apiClient.get(`/government/dashboard/monthly-distribution?period=${selectedPeriod}`)
      if (distributionResponse.data) {
        setMonthlyFoodDistribution(distributionResponse.data)
      }

      // Fetch KPIs
      const kpisResponse = await apiClient.get(`/government/dashboard/kpis?period=${selectedPeriod}`)
      if (kpisResponse.data) {
        setKpis(kpisResponse.data)
      }

      // Fetch alerts
      const alertsResponse = await apiClient.get(`/government/dashboard/alerts`)
      if (alertsResponse.data) {
        setAlerts(alertsResponse.data)
      }

      // Fetch top districts
      const topDistrictsResponse = await apiClient.get(`/government/dashboard/top-districts`)
      if (topDistrictsResponse.data) {
        setTopDistricts(topDistrictsResponse.data)
      }

      // Fetch milestones
      const milestonesResponse = await apiClient.get(`/government/dashboard/milestones`)
      if (milestonesResponse.data) {
        setMilestones(milestonesResponse.data)
      }

      // Fetch recent activities
      const activitiesResponse = await apiClient.get(`/government/dashboard/recent-activities`)
      if (activitiesResponse.data) {
        setRecentActivities(activitiesResponse.data)
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
                      <p className="text-sm font-medium leading-none">Monthly Food Distribution (Tons)</p>
                      <div className="mt-2 flex h-40 items-end gap-2">
                        {loading && monthlyFoodDistribution.length === 0 ? (
                          <div className="text-sm text-muted-foreground w-full text-center">Loading...</div>
                        ) : monthlyFoodDistribution.length === 0 ? (
                          <div className="text-sm text-muted-foreground w-full text-center">No data available</div>
                        ) : (
                          monthlyFoodDistribution.map((m) => {
                            const maxTons = Math.max(...monthlyFoodDistribution.map(d => d.tons), 200)
                            const h = Math.max(10, Math.min(100, (m.tons / maxTons) * 100))
                            return (
                              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                                <div className="w-full rounded-t-sm bg-primary/90" style={{ height: `${h}%` }} />
                                <span className="text-[10px] text-muted-foreground">{m.month}</span>
                              </div>
                            )
                          })
                        )}
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

            <div className="grid gap-6 md:grid-cols-3">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>System notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading && alerts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : alerts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No alerts</div>
                    ) : (
                      alerts.map((a, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-3 rounded-md border p-3">
                          <div>
                            <p className="text-sm font-medium leading-none">{a.title}</p>
                            <p className="text-xs text-muted-foreground">{a.desc}</p>
                          </div>
                          <Badge
                            variant={
                              a.severity === "High" ? "destructive" : a.severity === "Medium" ? "secondary" : "outline"
                            }
                          >
                            {a.severity}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

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

              {/* Upcoming Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>Important dates and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading && milestones.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : milestones.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No milestones</div>
                    ) : (
                      milestones.map((m) => (
                        <div key={m.title} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <p className="text-sm font-medium leading-none">{m.title}</p>
                            <p className="text-xs text-muted-foreground">{m.date}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">{m.days} days</div>
                        </div>
                      ))
                    )}
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
                              <p className="text-sm font-medium leading-none">{district.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {district.schools} schools • {district.students.toLocaleString()} students
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={district.coverage >= 95 ? "default" : "secondary"}>
                                {district.coverage}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={district.coverage} className="h-2" />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading && recentActivities.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : recentActivities.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No recent activities</div>
                    ) : (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
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
