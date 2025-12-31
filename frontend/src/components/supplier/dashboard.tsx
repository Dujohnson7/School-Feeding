import { useEffect, useState } from "react"
import { Calendar, Clock, DollarSign, Home, Package, Truck, TrendingUp, FileText } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { supplierService } from "./service/supplierService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SupplierStats {
  activeOrders: string
  monthlyRevenue: string
  deliveryRate: string
  customerRating: string
}

interface RecentOrder {
  id: string
  school: string
  items: string
  quantity: string
  deliveryDate: string
  status: "pending" | "delivered" | "in-transit"
  amount: string
}

interface UpcomingDelivery {
  id: string
  school: string
  date: string
  time: string
  items: string
  status: "scheduled"
}

interface PerformanceMetrics {
  onTimeDelivery: number
  qualityRating: number
  orderFulfillment: number
}

export function SupplierDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<SupplierStats>({
    activeOrders: "0",
    monthlyRevenue: "RWF 0",
    deliveryRate: "0%",
    customerRating: "0/5",
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<UpcomingDelivery[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    onTimeDelivery: 0,
    qualityRating: 0,
    orderFulfillment: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const supplierId = localStorage.getItem("userId")

      if (!supplierId) {
        toast.error("Supplier ID not found. Please login again.")
        setLoading(false)
        return
      }

      // Fetch dashboard statistics
      const statsData = await supplierService.getDashboardStats(supplierId)
      if (statsData) {
        setStats(statsData)
      }

      // Fetch recent orders
      const ordersData = await supplierService.getRecentOrders(supplierId, 4)
      if (ordersData) {
        setRecentOrders(ordersData)
      }

      // Fetch upcoming deliveries
      const deliveriesData = await supplierService.getUpcomingDeliveries(supplierId, 3)
      if (deliveriesData) {
        setUpcomingDeliveries(deliveriesData)
      }

      // Fetch performance metrics
      const metricsData = await supplierService.getPerformanceMetrics(supplierId)
      if (metricsData) {
        setPerformanceMetrics(metricsData)
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
      title: "Active Orders",
      key: "activeOrders" as keyof SupplierStats,
      icon: Package,
    },
    {
      title: "Monthly Revenue",
      key: "monthlyRevenue" as keyof SupplierStats,
      icon: DollarSign,
    },
    {
      title: "Delivery Rate",
      key: "deliveryRate" as keyof SupplierStats,
      icon: Truck,
    },
    {
      title: "Customer Rating",
      key: "customerRating" as keyof SupplierStats,
      icon: TrendingUp,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "in-transit":
        return <Badge className="bg-blue-600 hover:bg-blue-700">In Transit</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "scheduled":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <PageHeader
          title="Supplier Dashboard"
          homeTo="/supplier-dashboard"
          HomeIcon={Home}
          profileTo="/supplier-profile"
          userName="Fresh Foods Ltd"
          userEmail="supplier@freshfoods.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="SP"
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
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading && recentOrders.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading orders...</div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No recent orders</div>
                    ) : (
                      recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between space-x-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{order.school}</p>
                            <p className="text-xs text-muted-foreground">{order.items}</p>
                            <p className="text-xs text-muted-foreground">
                              <Calendar className="mr-1 inline h-3 w-3" />
                              {order.deliveryDate}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-xs text-muted-foreground mt-1">{order.amount}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deliveries */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deliveries</CardTitle>
                  <CardDescription>Scheduled deliveries for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading && upcomingDeliveries.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading deliveries...</div>
                    ) : upcomingDeliveries.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No upcoming deliveries</div>
                    ) : (
                      upcomingDeliveries.map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between space-x-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{delivery.school}</p>
                            <p className="text-xs text-muted-foreground">{delivery.items}</p>
                            <p className="text-xs text-muted-foreground">
                              <Clock className="mr-1 inline h-3 w-3" />
                              {delivery.date} {delivery.time ? `at ${delivery.time}` : ""}
                            </p>
                          </div>
                          <div className="text-right">{getStatusBadge(delivery.status)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your performance indicators for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.onTimeDelivery}%`}
                      </span>
                    </div>
                    <Progress value={loading ? 0 : performanceMetrics.onTimeDelivery} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quality Rating</span>
                      <span className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.qualityRating}/5`}
                      </span>
                    </div>
                    <Progress value={loading ? 0 : (performanceMetrics.qualityRating / 5) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Order Fulfillment</span>
                      <span className="text-sm text-muted-foreground">
                        {loading ? "..." : `${performanceMetrics.orderFulfillment}%`}
                      </span>
                    </div>
                    <Progress value={loading ? 0 : performanceMetrics.orderFulfillment} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <Package className="h-6 w-6" />
                    <span>View Orders</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <Truck className="h-6 w-6" />
                    <span>Schedule Delivery</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Generate Report</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <DollarSign className="h-6 w-6" />
                    <span>View Payments</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SupplierDashboard
