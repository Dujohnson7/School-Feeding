import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Check, FileText, Package, School, Truck } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

interface DashboardStats {
  totalSchools: number
  pendingRequests: number
  highPriorityRequests: number
  activeSuppliers: number
  foodDistributed: string
  districtName: string
}

interface StockLevel {
  itemName: string
  percentage: number
}

interface RecentRequest {
  schoolName: string
  items: string
  priority: "High" | "Medium" | "Low"
}

interface UpcomingDelivery {
  schoolName: string
  items: string
  deliveryDate: string
}

interface PerformanceMetrics {
  requestProcessingTime: number
  deliveryAccuracy: number
  schoolSatisfaction: number
  budgetUtilization: number
}

interface MonthlyDistribution {
  month: string
  value: number
}

export function DistrictDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    pendingRequests: 0,
    highPriorityRequests: 0,
    activeSuppliers: 0,
    foodDistributed: "0t",
    districtName: "",
  })
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([])
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<UpcomingDelivery[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    requestProcessingTime: 0,
    deliveryAccuracy: 0,
    schoolSatisfaction: 0,
    budgetUtilization: 0,
  })
  const [monthlyDistribution, setMonthlyDistribution] = useState<MonthlyDistribution[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const districtId = localStorage.getItem("districtId")

      if (!districtId) {
        toast.error("District ID not found. Please login again.")
        setLoading(false)
        return
      }

      // Fetch dashboard statistics
      const statsResponse = await apiClient.get(`/district/dashboard/stats?districtId=${districtId}`)
      if (statsResponse.data) {
        setStats(statsResponse.data)
      }

      // Fetch stock levels
      const stockResponse = await apiClient.get(`/district/dashboard/stock-levels?districtId=${districtId}`)
      if (stockResponse.data) {
        setStockLevels(stockResponse.data)
      }

      // Fetch recent requests
      const requestsResponse = await apiClient.get(`/district/dashboard/recent-requests?districtId=${districtId}&limit=4`)
      if (requestsResponse.data) {
        setRecentRequests(requestsResponse.data)
      }

      // Fetch upcoming deliveries
      const deliveriesResponse = await apiClient.get(`/district/dashboard/upcoming-deliveries?districtId=${districtId}&limit=3`)
      if (deliveriesResponse.data) {
        setUpcomingDeliveries(deliveriesResponse.data)
      }

      // Fetch performance metrics
      const metricsResponse = await apiClient.get(`/district/dashboard/performance?districtId=${districtId}`)
      if (metricsResponse.data) {
        setPerformanceMetrics(metricsResponse.data)
      }

      // Fetch monthly distribution
      const distributionResponse = await apiClient.get(`/district/dashboard/monthly-distribution?districtId=${districtId}`)
      if (distributionResponse.data) {
        setMonthlyDistribution(distributionResponse.data)
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>
      case "Low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge variant="outline">Medium</Badge>
    }
  }
  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Header */}
        <PageHeader
          title="District Dashboard"
          homeTo="/district-dashboard"
          HomeIcon={Package}
          profileTo="/district-profile"
          userName="District Coordinator"
          userEmail="coordinator@district.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="DC"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalSchools}</div>
                <p className="text-xs text-muted-foreground">In {stats.districtName || "District"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">{stats.highPriorityRequests} high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.activeSuppliers}</div>
                <p className="text-xs text-muted-foreground">All operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Distributed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.foodDistributed}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>District Overview</CardTitle>
                <CardDescription>Food distribution and requests across schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {loading && stockLevels.length === 0 ? (
                      <>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Rice Stock</div>
                            <div className="text-sm text-muted-foreground">78%</div>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Beans Stock</div>
                            <div className="text-sm text-muted-foreground">65%</div>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Maize Stock</div>
                            <div className="text-sm text-muted-foreground">42%</div>
                          </div>
                          <Progress value={42} className="h-2" />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Vegetables Stock</div>
                            <div className="text-sm text-muted-foreground">25%</div>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </>
                    ) : (
                      stockLevels.map((stock, index) => (
                        <div key={index}>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">{stock.itemName}</div>
                            <div className="text-sm text-muted-foreground">{stock.percentage}%</div>
                          </div>
                          <Progress value={stock.percentage} className="h-2" />
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-4 text-sm font-medium">Monthly Distribution</h3>
                    <div className="h-[200px] w-full bg-muted/50">
                      <div className="flex h-full items-end justify-between px-2">
                        {loading && monthlyDistribution.length === 0 ? (
                          <>
                            <div className="h-[40%] w-[8%] bg-primary"></div>
                            <div className="h-[60%] w-[8%] bg-primary"></div>
                            <div className="h-[75%] w-[8%] bg-primary"></div>
                            <div className="h-[90%] w-[8%] bg-primary"></div>
                            <div className="h-[65%] w-[8%] bg-primary"></div>
                            <div className="h-[45%] w-[8%] bg-primary"></div>
                            <div className="h-[55%] w-[8%] bg-primary"></div>
                            <div className="h-[70%] w-[8%] bg-primary"></div>
                            <div className="h-[50%] w-[8%] bg-primary"></div>
                            <div className="h-[30%] w-[8%] bg-primary"></div>
                          </>
                        ) : (
                          monthlyDistribution.map((month, index) => {
                            const maxValue = Math.max(...monthlyDistribution.map(m => m.value), 100)
                            const height = (month.value / maxValue) * 100
                            return (
                              <div key={index} className="h-[8%] w-[8%] bg-primary" style={{ height: `${Math.max(10, height)}%` }}></div>
                            )
                          })
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      {loading && monthlyDistribution.length === 0 ? (
                        <>
                          <div>Jan</div>
                          <div>Feb</div>
                          <div>Mar</div>
                          <div>Apr</div>
                          <div>May</div>
                          <div>Jun</div>
                          <div>Jul</div>
                          <div>Aug</div>
                          <div>Sep</div>
                          <div>Oct</div>
                        </>
                      ) : (
                        monthlyDistribution.map((month, index) => (
                          <div key={index}>{month.month}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Latest food requests from schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && recentRequests.length === 0 ? (
                    <>
                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div>
                          <p className="font-medium">Loading...</p>
                          <p className="text-sm text-muted-foreground">Please wait</p>
                        </div>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                    </>
                  ) : recentRequests.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">No recent requests</div>
                  ) : (
                    recentRequests.map((request, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div>
                          <p className="font-medium">{request.schoolName}</p>
                          <p className="text-sm text-muted-foreground">{request.items}</p>
                        </div>
                        {getPriorityBadge(request.priority)}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link to="/district-approvals" className="flex w-full items-center justify-center">
                    View All Requests
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Scheduled food deliveries to schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && upcomingDeliveries.length === 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Loading...</p>
                          <p className="text-sm text-muted-foreground">Please wait</p>
                        </div>
                        <p className="text-sm">-</p>
                      </div>
                    </>
                  ) : upcomingDeliveries.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">No upcoming deliveries</div>
                  ) : (
                    upcomingDeliveries.map((delivery, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{delivery.schoolName}</p>
                          <p className="text-sm text-muted-foreground">{delivery.items}</p>
                        </div>
                        <p className="text-sm">{delivery.deliveryDate}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>District Performance</CardTitle>
                <CardDescription>Key metrics for district operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">Request Processing Time</div>
                      <div className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.requestProcessingTime} days avg.`}
                      </div>
                    </div>
                    <Progress value={loading ? 0 : (performanceMetrics.requestProcessingTime / 2) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">Delivery Accuracy</div>
                      <div className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.deliveryAccuracy}%`}
                      </div>
                    </div>
                    <Progress value={loading ? 0 : performanceMetrics.deliveryAccuracy} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">School Satisfaction</div>
                      <div className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.schoolSatisfaction}%`}
                      </div>
                    </div>
                    <Progress value={loading ? 0 : performanceMetrics.schoolSatisfaction} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">Budget Utilization</div>
                      <div className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.budgetUtilization}%`}
                      </div>
                    </div>
                    <Progress value={loading ? 0 : performanceMetrics.budgetUtilization} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DistrictDashboard