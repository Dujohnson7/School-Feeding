import { useEffect, useState, useCallback } from "react"
import { Home, Package, Truck, TrendingUp, FileText, Activity, Eye } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { supplierService, Order } from "./service/supplierService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SupplierStats {
  activeOrders: string
  pendingDeliveries: string
  monthlyRevenue: string
  performanceScore: string
  activeOrdersTrend: string
  pendingDeliveriesLabel: string
  monthlyRevenueTrend: string
  performanceScoreLabel: string
}

interface RecentOrder {
  id: string
  school: string
  items: string
  deliveryDate: string
  status: string
}

interface UpcomingDelivery {
  id: string
  school: string
  items: string
  date: string
  time: string
  label: string
}

interface PerformanceMetrics {
  onTimeDelivery: number
  qualityScore: number
  orderFulfillment: number
  customerSatisfaction: number
}

interface MonthlySummary {
  ordersCompleted: number
  foodDelivered: string
  schoolsServed: number
  averageRating: string
  revenue: string
}

export function SupplierDashboard() {
  const [loading, setLoading] = useState(true)
  const [supplierNames, setSupplierNames] = useState("Supplier")
  const [supplierEmail, setSupplierEmail] = useState("supplier@sf.rw")

  const [stats, setStats] = useState<SupplierStats>({
    activeOrders: "0",
    pendingDeliveries: "0",
    monthlyRevenue: "RWF 0",
    performanceScore: "0/5",
    activeOrdersTrend: "Updated just now",
    pendingDeliveriesLabel: "Check schedule",
    monthlyRevenueTrend: "Current month",
    performanceScoreLabel: "Based on ratings"
  })

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<UpcomingDelivery[]>([])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    onTimeDelivery: 0,
    qualityScore: 0,
    orderFulfillment: 0,
    customerSatisfaction: 0,
  })

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    ordersCompleted: 0,
    foodDelivered: "0t",
    schoolsServed: 0,
    averageRating: "0/5",
    revenue: "RWF 0"
  })

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch {
      return dateString
    }
  }

  const mapBackendOrderToRecent = useCallback((order: Order): RecentOrder => {
    const itemsList = order.requestItem?.requestItemDetails
      ?.map(detail => detail.item?.name || "Item")
      .slice(0, 2)
      .join(", ") || "No items"

    return {
      id: order.id.substring(0, 8).toUpperCase(),
      school: order.requestItem?.school?.name || "Unknown School",
      items: itemsList + (order.requestItem?.requestItemDetails?.length && order.requestItem.requestItemDetails.length > 2 ? "..." : ""),
      deliveryDate: formatDate(order.deliveryDate),
      status: order.deliveryStatus || "Processing"
    }
  }, [])

  const mapBackendOrderToUpcoming = useCallback((order: Order): UpcomingDelivery => {
    const totalQty = order.requestItem?.requestItemDetails?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0
    const itemsSummary = `${order.requestItem?.requestItemDetails?.[0]?.item?.name || "Items"} - ${totalQty}kg`

    return {
      id: order.id,
      school: order.requestItem?.school?.name || "Unknown School",
      items: itemsSummary,
      date: formatDate(order.expectedDate || order.deliveryDate),
      time: "Scheduled",
      label: formatDate(order.expectedDate || order.deliveryDate)
    }
  }, [])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const supplierId = localStorage.getItem("userId")
      const names = localStorage.getItem("names") || "Supplier"
      const email = localStorage.getItem("email") || "supplier@sf.rw"

      setSupplierNames(names)
      setSupplierEmail(email)

      if (!supplierId) {
        setLoading(false)
        return
      }

      // Fetch all metrics in parallel
      const [
        monthlyRevenue,
        activeOrdersCount,
        pendingDeliveriesCount,
        avgPerformance,
        avgRating,
        completedOrdersCount,
        foodDelivered,
        schoolsServed,
        recentDeliveries,
        upcomingDeliveriesData
      ] = await Promise.all([
        supplierService.getMonthlyRevenue(supplierId).catch(() => 0),
        supplierService.getActiveOrderBySupplier(supplierId).catch(() => 0),
        supplierService.findPendingDeliveriesBySupplierId(supplierId).catch(() => 0),
        supplierService.findAvgPerformanceScore(supplierId).catch(() => 0),
        supplierService.findAverageRatingMonthly(supplierId).catch(() => 0),
        supplierService.findOrderByCompleted(supplierId).catch(() => 0),
        supplierService.findFoodDelivered(supplierId).catch(() => 0),
        supplierService.findSchoolServedBySupplierId(supplierId).catch(() => 0),
        supplierService.getRecentDeliveriesBySupplier(supplierId).catch(() => []),
        supplierService.getUpcomingDeliveries(supplierId).catch(() => [])
      ])

      setStats({
        activeOrders: activeOrdersCount.toString(),
        pendingDeliveries: pendingDeliveriesCount.toString(),
        monthlyRevenue: new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(monthlyRevenue),
        performanceScore: `${avgPerformance.toFixed(1)}/5`,
        activeOrdersTrend: "",
        pendingDeliveriesLabel: `${pendingDeliveriesCount} pending`,
        monthlyRevenueTrend: "This month",
        performanceScoreLabel: "Overall score"
      })

      setPerformanceMetrics({
        onTimeDelivery: avgPerformance,
        qualityScore: avgRating * 20, // Assuming rating is 0-5, convert to percentage
        orderFulfillment: 98, // Placeholder or fetch if available
        customerSatisfaction: avgRating * 20
      })

      setMonthlySummary({
        ordersCompleted: completedOrdersCount,
        foodDelivered: `${(foodDelivered / 1000).toFixed(1)}t`,
        schoolsServed: schoolsServed,
        averageRating: `${avgRating.toFixed(1)}/5`,
        revenue: new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(monthlyRevenue)
      })

      if (Array.isArray(recentDeliveries)) {
        setRecentOrders(recentDeliveries.slice(0, 4).map(mapBackendOrderToRecent))
      }

      if (Array.isArray(upcomingDeliveriesData)) {
        setUpcomingDeliveries(upcomingDeliveriesData.slice(0, 3).map(mapBackendOrderToUpcoming))
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }, [mapBackendOrderToRecent, mapBackendOrderToUpcoming])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase()
    switch (s) {
      case "DELIVERED":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-3 py-1 text-[10px] font-semibold">Delivered</Badge>
      case "DISPATCHED":
        return <Badge className="bg-purple-600 hover:bg-purple-700 border-none px-3 py-1 text-[10px] font-semibold">Dispatched</Badge>
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 text-[10px] font-semibold">Processing</Badge>
      case "APPROVED":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-3 py-1 text-[10px] font-semibold">Approved</Badge>
      case "SCHEDULED":
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-3 py-1 text-[10px] font-semibold">Scheduled</Badge>
      case "CANCELLED":
      case "REJECTED":
        return <Badge variant="destructive" className="px-3 py-1 text-[10px] font-semibold">Cancelled</Badge>
      default:
        return <Badge variant="outline" className="px-3 py-1 text-[10px] font-semibold">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen">
      <div className="flex flex-1 flex-col pb-10">
        <PageHeader
          title="Supplier Dashboard"
          homeTo="/supplier-dashboard"
          HomeIcon={Home}
          profileTo="/supplier-profile"
          userName={supplierNames}
          userEmail={supplierEmail}
          avatarSrc="/userIcon.png"
          avatarFallback="SP"
        />

        <main className="flex-1 px-6 space-y-6">
          {/* Top Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-sm h-full font-sans">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Orders</p>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.activeOrders}</div>
                    <p className="text-[11px] text-slate-400">{stats.activeOrdersTrend}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <Package className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-full font-sans">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Deliveries</p>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.pendingDeliveries}</div>
                    <p className="text-[11px] text-slate-400">{stats.pendingDeliveriesLabel}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <Truck className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-full font-sans">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Monthly Revenue</p>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.monthlyRevenue}</div>
                    <p className="text-[11px] text-emerald-500 font-medium">{stats.monthlyRevenueTrend}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-full font-sans">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Performance Score</p>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.performanceScore}</div>
                    <p className="text-[11px] text-slate-400">{stats.performanceScoreLabel}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <Activity className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Row 2: Recent Orders (2/3) and Performance Metrics (1/3) */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm h-full font-sans">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                  <CardDescription className="text-xs">Latest orders from schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-50">
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">School</th>
                          <th className="pb-3 font-medium">Items</th>
                          <th className="pb-3 font-medium">Delivery Date</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="text-xs text-slate-600 hover:bg-slate-50/50 transition-colors cursor-pointer">
                            <td className="py-4 font-semibold text-slate-900">{order.id}</td>
                            <td className="py-4">{order.school}</td>
                            <td className="py-4">{order.items}</td>
                            <td className="py-4 font-medium">{order.deliveryDate}</td>
                            <td className="py-4">{getStatusBadge(order.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm h-full font-sans">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold">Performance Metrics</CardTitle>
                  <CardDescription className="text-xs">Your supplier performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { label: "On-time Delivery", value: performanceMetrics.onTimeDelivery },
                    { label: "Quality Score", value: performanceMetrics.qualityScore },
                    { label: "Order Fulfilment", value: performanceMetrics.orderFulfillment },
                    { label: "Customer Satisfaction", value: performanceMetrics.customerSatisfaction }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700">{metric.label}</span>
                        <span className="text-xs font-bold text-slate-900">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-1.5 bg-slate-100" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Upcoming Deliveries, Monthly Summary, Quick Actions (Parallel) */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm h-full font-sans">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Upcoming Deliveries</CardTitle>
                  <CardDescription className="text-xs">Scheduled deliveries for this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-1">
                  {upcomingDeliveries.map((delivery) => (
                    <div key={delivery.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 p-2 rounded-lg transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{delivery.school}</p>
                        <p className="text-xs text-slate-400">{delivery.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-blue-600">{delivery.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">{delivery.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm h-full font-sans">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Monthly Summary</CardTitle>
                  <CardDescription className="text-xs">Performance summary for this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                      <span className="text-emerald-600 text-xl font-bold">{monthlySummary.ordersCompleted}</span>
                      <span className="text-[10px] text-emerald-600/70 font-medium whitespace-nowrap">Orders Completed</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                      <span className="text-blue-600 text-xl font-bold">{monthlySummary.foodDelivered}</span>
                      <span className="text-[10px] text-blue-600/70 font-medium whitespace-nowrap">Food Delivered</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Schools Served</span>
                      <span className="font-bold text-slate-900">{monthlySummary.schoolsServed}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Average Rating</span>
                      <span className="font-bold text-slate-900">{monthlySummary.averageRating}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Revenue</span>
                      <span className="font-bold text-slate-900">{monthlySummary.revenue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm h-full font-sans">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                  <CardDescription className="text-xs">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-4">
                  {[
                    { label: "View All Orders", icon: Eye },
                    { label: "Schedule Delivery", icon: Truck },
                    { label: "Generate Report", icon: FileText },
                    { label: "Update Inventory", icon: Package }
                  ].map((action) => (
                    <Button key={action.label} variant="ghost" className="w-full justify-start text-xs font-medium h-12 bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 shadow-sm rounded-lg py-0 px-4 group">
                      <action.icon className="h-4 w-4 mr-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SupplierDashboard
