import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Check, FileText, Package, School, Truck, Clock } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { toast } from "sonner"
import { districtService } from "./service/districtService"

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
import { Skeleton } from "@/components/ui/skeleton"

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
  status: string
}

interface UpcomingDelivery {
  schoolName: string
  items: string
  deliveryDate: string
  supplierName?: string
  status?: string
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
  const [nearDeadlineDeliveries, setNearDeadlineDeliveries] = useState<UpcomingDelivery[]>([])

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

      // Fetch stats and items in parallel with individual error handling
      const fetchStat = async (func: any, fallback: any) => {
        try {
          return await func(districtId)
        } catch (err) {
          console.error(`Error fetching stat:`, err)
          return fallback
        }
      }

      const [totalSchools, pendingRequests, activeSuppliers, foodDistributed, allItems] = await Promise.all([
        fetchStat(districtService.getTotalSchoolDistrict, 0),
        fetchStat(districtService.getTotalRequestDistrict, 0),
        fetchStat(districtService.getTotalDistrictSupplier, 0),
        fetchStat(districtService.getTotalFoodDistributed, 0),
        districtService.getAllItems().catch(() => [])
      ])

      // Create item name lookup map
      const itemMap = new Map()
      if (allItems && Array.isArray(allItems)) {
        allItems.forEach((item: any) => {
          itemMap.set(item.id, item.name)
        })
      }

      setStats(prev => ({
        ...prev,
        totalSchools: totalSchools || 0,
        pendingRequests: pendingRequests || 0,
        activeSuppliers: activeSuppliers || 0,
        foodDistributed: `${foodDistributed || 0}t`
      }))

      // Fetch district details for the name
      try {
        const today = new Date().toISOString().split('T')[0]
        const lastYear = new Date()
        lastYear.setFullYear(lastYear.getFullYear() - 1)
        const fromDate = lastYear.toISOString().split('T')[0]
        const overview = await districtService.getDistrictOverviewReport(districtId, fromDate, today)
        if (overview && overview.length > 0) {
          setStats(prev => ({ ...prev, districtName: overview[0].districtName }))
        }
      } catch (err) {
        console.error("Error fetching district overview name:", err)
      }

      // Fetch analytics for performance metrics
      try {
        const analytics = await districtService.getAnalyticsStats(districtId, "monthly")
        if (analytics) {
          setPerformanceMetrics({
            requestProcessingTime: analytics.avgProcessingDays || 2,
            deliveryAccuracy: analytics.deliveryAccuracy || 95,
            schoolSatisfaction: analytics.satisfactionRate || 88,
            budgetUtilization: analytics.budgetUtilization || 75
          })
        }
      } catch (err) {
        console.error("Error fetching analytics stats:", err)
      }

      // Fetch recent requests from verified endpoint
      try {
        const allRequests = await districtService.getAllRequests(districtId)
        if (allRequests && Array.isArray(allRequests)) {
          // Sort by creation date or ID to get recent ones
          const sortedRequests = [...allRequests].sort((a: any, b: any) => {
            const dateA = a.created ? new Date(a.created).getTime() : 0
            const dateB = b.created ? new Date(b.created).getTime() : 0
            return dateB - dateA
          })

          const formattedRequests: RecentRequest[] = sortedRequests.slice(0, 5).map((item: any) => ({
            schoolName: item.school?.name || item.school?.school || "Unknown School",
            items: item.requestItemDetails?.map((detail: any) => {
              const itemName = detail.item?.name || itemMap.get(detail.item?.id) || "Items"
              return itemName
            }).join(", ") || item.description || "Items",
            status: item.requestStatus
          }))
          setRecentRequests(formattedRequests)
        }
      } catch (err) {
        console.error("Error fetching recent requests:", err)
      }

      // Fetch recent deliveries (Complete Deliveries)
      const recentDeliveriesData = await districtService.getRecentDeliveriesByDistrict(districtId)
      if (recentDeliveriesData && Array.isArray(recentDeliveriesData)) {
        const formattedDeliveries: UpcomingDelivery[] = recentDeliveriesData.map((order: any) => ({
          schoolName: order.requestItem?.school?.name || "Unknown School",
          supplierName: order.supplier?.companyName || order.supplier?.names || "Unknown Supplier",
          items: order.requestItem?.requestItemDetails?.map((detail: any) => {
            return detail.item?.name || itemMap.get(detail.item?.id) || "Food Items"
          }).join(", ") || "Food Items",
          deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"
        }))
        setUpcomingDeliveries(formattedDeliveries)
      }

      // Fetch stock levels
      const stockData = await districtService.getStockPercentageByCategory(districtId)
      if (stockData && Array.isArray(stockData)) {
        const formattedStock: StockLevel[] = stockData.map((item: any) => ({
          itemName: item[0],
          percentage: Math.round(item[1])
        }))
        setStockLevels(formattedStock)
      }

      // Fetch monthly distribution
      const distributionData = await districtService.getMonthlyDistribution(districtId)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      // Initialize with zeros for all months to ensure chart is always visible
      let formattedDistribution: MonthlyDistribution[] = monthNames.map(name => ({ month: name, value: 0 }))

      if (distributionData && Array.isArray(distributionData)) {
        distributionData.forEach((item: any) => {
          const monthIdx = item[0] - 1
          if (monthIdx >= 0 && monthIdx < 12) {
            formattedDistribution[monthIdx].value = item[1]
          }
        })
      }
      setMonthlyDistribution(formattedDistribution)

      // Fetch deliveries near deadline
      try {
        const nearDeadlineData = await districtService.getDeliveriesNearToDeadlineByDistrict(districtId)
        if (nearDeadlineData && Array.isArray(nearDeadlineData)) {
          const formatted: UpcomingDelivery[] = nearDeadlineData.map((order: any) => ({
            schoolName: order.requestItem?.school?.name || "Unknown School",
            supplierName: order.supplier?.companyName || order.supplier?.names || "Unknown Supplier",
            status: order.deliveryStatus,
            items: order.requestItem?.requestItemDetails?.map((detail: any) => {
              return detail.item?.name || itemMap.get(detail.item?.id) || "Food Items"
            }).join(", ") || "Food Items",
            deliveryDate: order.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : "Urgent"
          }))
          setNearDeadlineDeliveries(formatted)
        }
      } catch (err) {
        console.error("Error fetching near deadline deliveries:", err)
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
      case "APPROVE":
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
          userName={stats.districtName ? `${stats.districtName} Coordinator` : "District Coordinator"}
          userEmail={`coordinator@${stats.districtName?.toLowerCase() || 'district'}.rw`}
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
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                          <div className="mb-2 flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))
                    ) : stockLevels.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-muted-foreground italic text-sm">
                        No category stock data available
                      </div>
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
                        {loading && monthlyDistribution.every(m => m.value === 0) ? (
                          Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-[5%] w-[6%] bg-primary/20 animate-pulse"></div>
                          ))
                        ) : (
                          monthlyDistribution.map((month, index) => {
                            const maxValue = Math.max(...monthlyDistribution.map(m => m.value), 10)
                            const height = (month.value / maxValue) * 100
                            // If value is 0, show a tiny sliver or nothing, but keep the slot
                            return (
                              <div
                                key={index}
                                className={`w-[6%] transition-all duration-500 ${month.value > 0 ? "bg-primary" : "bg-primary/10"}`}
                                style={{ height: `${Math.max(2, height)}%` }}
                                title={`${month.month}: ${month.value}`}
                              ></div>
                            )
                          })
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground overflow-hidden">
                      {monthlyDistribution.map((month, index) => (
                        <div key={index} className="w-[8%] text-center">{month.month}</div>
                      ))}
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
                        {getStatusBadge(request.status)}
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-600">
                  <Clock className="h-4 w-4" />
                  Urgent Deliveries
                </CardTitle>
                <CardDescription>Deliveries near to deadline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && nearDeadlineDeliveries.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  ) : nearDeadlineDeliveries.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4 italic">No urgent deliveries</div>
                  ) : (
                    nearDeadlineDeliveries.map((delivery, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-muted pb-2 last:border-0 last:pb-0">
                        <div className="min-w-0 pr-2">
                          <p className="font-medium truncate text-sm">{delivery.schoolName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {delivery.supplierName && <span className="text-primary font-semibold">{delivery.supplierName} • </span>}
                            {delivery.items}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] whitespace-nowrap bg-rose-50 text-rose-700 border-rose-200">
                          Due: {delivery.deliveryDate}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complete Deliveries</CardTitle>
                <CardDescription>Completed food deliveries for schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && upcomingDeliveries.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  ) : upcomingDeliveries.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4 italic">No completed deliveries</div>
                  ) : (
                    upcomingDeliveries.map((delivery, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-muted pb-2 last:border-0 last:pb-0">
                        <div className="min-w-0 pr-2">
                          <p className="font-medium truncate text-sm">{delivery.schoolName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {delivery.supplierName && <span className="text-primary font-semibold">{delivery.supplierName} • </span>}
                            {delivery.items}
                          </p>
                        </div>
                        <p className="text-xs font-mono">{delivery.deliveryDate}</p>
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