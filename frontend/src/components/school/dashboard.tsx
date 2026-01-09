
import { useState, useEffect } from "react"
import { Calendar, Package, ShoppingCart, User, AlertTriangle } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import { schoolService, SchoolStats, RecentDelivery } from "./service/schoolService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Badge
} from "@/components/ui/badge"
import { RequestFoodDialog } from "@/components/school/request-food-dialog"
import { FoodStockGauge } from "@/components/school/food-stock-gauge"

interface StockPrediction {
  item: string
  daysRemaining: number
  dailyUsage: number
  remaining: number
  status: "Critical" | "Low" | "Good"
}

export function SchoolDashboard() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<SchoolStats>({
    foodStockLevel: 0,
    stockLevelStatus: "Low",
    pendingRequests: 0,
    highPriorityRequests: 0,
    normalPriorityRequests: 0,
    nextDeliveryDate: "",
    nextDeliveryStatus: "",
    nextDeliveryTime: "",
    studentsFedToday: 0,
    totalRegisteredStudents: 0,
  })
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([])
  const [predictions, setPredictions] = useState<StockPrediction[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const schoolId = localStorage.getItem("schoolId")

      if (!schoolId) {
        toast.error("School ID not found. Please login again.")
        setLoading(false)
        return
      }

      // Fetch all dashboard data in parallel for better performance
      const results = await Promise.allSettled([
        schoolService.getFoodStockLevel(schoolId),
        schoolService.getTotalStudent(schoolId),
        schoolService.getPendingRequestCount(schoolId),
        schoolService.getStudentServedCount(schoolId),
        schoolService.getDeliveryState(schoolId),
        schoolService.getAllRecentDeliveries(schoolId),
        schoolService.getSchoolStockManagementReport(
          schoolId,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          new Date().toISOString().split('T')[0]
        ),
        schoolService.getAllItems()
      ])

      const [
        stockLevel,
        totalStudents,
        pendingRequests,
        studentsServed,
        deliveryState,
        recentDeliveriesData,
        stockReport,
        globalItems
      ] = results

      const newStats: SchoolStats = { ...stats }

      if (stockLevel.status === "fulfilled") {
        const roundedLevel = Math.round(stockLevel.value)
        newStats.foodStockLevel = roundedLevel
        // Determine status based on rate
        if (roundedLevel < 20) newStats.stockLevelStatus = "Critical"
        else if (roundedLevel < 50) newStats.stockLevelStatus = "Low"
        else newStats.stockLevelStatus = "Good"
      }

      if (totalStudents.status === "fulfilled") {
        newStats.totalRegisteredStudents = totalStudents.value
      }

      if (pendingRequests.status === "fulfilled") {
        newStats.pendingRequests = pendingRequests.value
      }

      if (studentsServed.status === "fulfilled") {
        newStats.studentsFedToday = studentsServed.value
      }

      if (deliveryState.status === "fulfilled" && deliveryState.value) {
        newStats.nextDeliveryDate = deliveryState.value.deliveryDate || ""
        newStats.nextDeliveryStatus = deliveryState.value.deliveryStatus || ""
      }

      setStats(newStats)

      if (recentDeliveriesData.status === "fulfilled" && recentDeliveriesData.value) {
        const itemsList = globalItems.status === "fulfilled" ? globalItems.value : []

        // Map Orders to RecentDelivery format
        const mappedDeliveries: RecentDelivery[] = recentDeliveriesData.value.map((order: any) => {
          // Extract item names from details and match with supplier items if possible
          const itemDetails = order.requestItem?.requestItemDetails || []
          const supplierItems = order.supplier?.items || []

          let itemNames = "Food Delivery"
          if (itemDetails.length > 0) {
            itemNames = itemDetails.map((detail: any) => {
              // Try to find name in global items first, then supplier items, then the detail itself
              const itemInGlobal = itemsList.find((i: any) => i.id === detail.item?.id)
              const matchedItem = itemInGlobal || supplierItems.find((si: any) => si.id === detail.item?.id)

              return matchedItem?.name || detail.item?.name || "Item"
            }).join(", ")
          }

          return {
            id: order.id,
            date: order.deliveryDate || order.orderDate,
            items: itemNames,
            supplier: order.supplier?.companyName || order.supplier?.names || "Global Supplier",
            status: order.deliveryStatus || "Pending"
          }
        })
        setRecentDeliveries(mappedDeliveries)
      }

      // Calculate stock predictions
      if (stockReport.status === "fulfilled" && stockReport.value) {
        const reportData = stockReport.value
        const calculatedPredictions: StockPrediction[] = reportData.map((item: any) => {
          const dailyUsage = item.used / 30 // Average over 30 days
          const daysRemaining = dailyUsage > 0 ? Math.floor(item.remaining / dailyUsage) : 99 // Cap at 99 if no usage

          let status: "Critical" | "Low" | "Good" = "Good"
          if (daysRemaining < 3) status = "Critical"
          else if (daysRemaining < 7) status = "Low"

          return {
            item: item.item,
            daysRemaining,
            dailyUsage,
            remaining: item.remaining,
            status
          }
        }).sort((a: any, b: any) => a.daysRemaining - b.daysRemaining) // Show most urgent first

        setPredictions(calculatedPredictions)
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Pending</Badge>

    switch (status.toLowerCase()) {
      case "delivered":
      case "complete":
      case "completed":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "pending":
      case "processing":
      case "waiting":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">{status}</Badge>
      case "in-transit":
      case "transit":
      case "shipping":
        return <Badge className="bg-blue-500">In Transit</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPredictionBadge = (status: string) => {
    switch (status) {
      case "Critical":
        return <Badge className="ml-auto bg-red-500">Critical</Badge>
      case "Low":
        return <Badge className="ml-auto bg-amber-500">Low</Badge>
      default:
        return <Badge className="ml-auto bg-green-500">Good</Badge>
    }
  }

  const studentsFedPercentage = stats.totalRegisteredStudents > 0
    ? (stats.studentsFedToday / stats.totalRegisteredStudents) * 100
    : 0

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Header */}
        <PageHeader
          title="School Admin Dashboard"
          homeTo="/school-dashboard"
          HomeIcon={Package}
          profileTo="/school-profile"
          userName="School Admin"
          userEmail="admin@school.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="SC"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Stock Level</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <FoodStockGauge value={loading ? 0 : stats.foodStockLevel} />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {loading
                    ? "Loading..."
                    : `Current stock level: ${stats.stockLevelStatus}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.pendingRequests}</div>
                <div className="flex items-center space-x-2 mt-2">
                  {loading ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                  ) : (
                    <>
                      {stats.pendingRequests > 0 ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                          {stats.pendingRequests} Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">No pending requests</Badge>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading
                    ? "..."
                    : stats.nextDeliveryDate
                      ? stats.nextDeliveryDate
                      : "No delivery"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : stats.nextDeliveryStatus
                      ? stats.nextDeliveryStatus
                      : "No upcoming delivery"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Fed Today</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.studentsFedToday}</div>
                <p className="text-xs text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : `Out of ${stats.totalRegisteredStudents} registered`}
                </p>
                <Progress value={loading ? 0 : studentsFedPercentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Overview of the last 5 food deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                    <div>Date</div>
                    <div>Items</div>
                    <div>Supplier</div>
                    <div>Status</div>
                  </div>
                  {loading && recentDeliveries.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4">Loading deliveries...</div>
                  ) : recentDeliveries.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4">No recent deliveries</div>
                  ) : (
                    recentDeliveries.map((delivery) => (
                      <div key={delivery.id} className="grid grid-cols-4 items-center text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{delivery.date}</span>
                        </div>
                        <div>{delivery.items}</div>
                        <div>{delivery.supplier}</div>
                        <div>{getStatusBadge(delivery.status)}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Stock Prediction</CardTitle>
                <CardDescription>Estimated days of stock remaining based on usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && predictions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Loading predictions...</div>
                  ) : predictions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No stock data available for prediction</div>
                  ) : (
                    predictions.map((p, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${p.status === 'Critical' ? 'bg-red-100' : p.status === 'Low' ? 'bg-amber-100' : 'bg-green-100'
                          }`}>
                          {p.status === 'Good' ? (
                            <Package className={`h-5 w-5 ${p.status === 'Good' ? 'text-green-600' : ''}`} />
                          ) : (
                            <AlertTriangle className={`h-5 w-5 ${p.status === 'Critical' ? 'text-red-600' : 'text-amber-600'
                              }`} />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{p.item}</p>
                            {getPredictionBadge(p.status)}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {p.daysRemaining} days left · {p.remaining.toFixed(1)}kg in stock
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.dailyUsage.toFixed(1)}kg / day
                            </p>
                          </div>
                          <Progress
                            value={Math.min(100, (p.daysRemaining / 30) * 100)}
                            className={`h-1 ${p.status === 'Critical' ? 'bg-red-100' : p.status === 'Low' ? 'bg-amber-100' : 'bg-green-100'
                              }`}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setOpen(true)} className="w-full">
                  Request Food
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div >

      <RequestFoodDialog open={open} onOpenChange={setOpen} />
    </div >
  )
}

export default SchoolDashboard