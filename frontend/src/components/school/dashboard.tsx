
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Calendar, Clock, Package, ShoppingCart, User } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RequestFoodDialog } from "@/components/school/request-food-dialog"
import { FoodStockGauge } from "@/components/school/food-stock-gauge"

interface SchoolStats {
  foodStockLevel: number
  stockLevelStatus: string
  pendingRequests: number
  highPriorityRequests: number
  normalPriorityRequests: number
  nextDeliveryDate: string
  nextDeliveryTime: string
  studentsFedToday: number
  totalRegisteredStudents: number
}

interface RecentDelivery {
  id: string
  date: string
  items: string
  supplier: string
  status: string
}

interface UpcomingSchedule {
  id: string
  title: string
  date: string
  time: string
  status: "Scheduled" | "Upcoming"
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
    nextDeliveryTime: "",
    studentsFedToday: 0,
    totalRegisteredStudents: 0,
  })
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([])
  const [upcomingSchedule, setUpcomingSchedule] = useState<UpcomingSchedule[]>([])

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

      // Fetch dashboard statistics
      const statsResponse = await apiClient.get(`/school/dashboard/stats?schoolId=${schoolId}`)
      if (statsResponse.data) {
        setStats(statsResponse.data)
      }

      // Fetch recent deliveries
      const deliveriesResponse = await apiClient.get(`/school/dashboard/recent-deliveries?schoolId=${schoolId}&limit=5`)
      if (deliveriesResponse.data) {
        setRecentDeliveries(deliveriesResponse.data)
      }

      // Fetch upcoming schedule
      const scheduleResponse = await apiClient.get(`/school/dashboard/upcoming-schedule?schoolId=${schoolId}&limit=4`)
      if (scheduleResponse.data) {
        setUpcomingSchedule(scheduleResponse.data)
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "in-transit":
        return <Badge className="bg-blue-500">In Transit</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getScheduleBadge = (status: string) => {
    if (status === "Scheduled") {
      return <Badge className="ml-auto">Scheduled</Badge>
    }
    return <Badge variant="outline" className="ml-auto">Upcoming</Badge>
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
                      {stats.highPriorityRequests > 0 && (
                        <Badge variant="destructive">High Priority: {stats.highPriorityRequests}</Badge>
                      )}
                      {stats.normalPriorityRequests > 0 && (
                        <Badge variant="outline">Normal: {stats.normalPriorityRequests}</Badge>
                      )}
                      {stats.pendingRequests === 0 && (
                        <Badge variant="outline">No pending requests</Badge>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading
                    ? "..."
                    : stats.nextDeliveryDate
                      ? stats.nextDeliveryDate === "Tomorrow"
                        ? "Tomorrow"
                        : stats.nextDeliveryDate
                      : "No delivery scheduled"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : stats.nextDeliveryTime
                      ? `${stats.nextDeliveryDate} - ${stats.nextDeliveryTime}`
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
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All
                </Button>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Food delivery and serving schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && upcomingSchedule.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Loading schedule...</div>
                  ) : upcomingSchedule.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No upcoming schedule</div>
                  ) : (
                    upcomingSchedule.map((schedule) => (
                      <div key={schedule.id} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{schedule.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {schedule.date} {schedule.time ? `, ${schedule.time}` : ""}
                          </p>
                        </div>
                        {getScheduleBadge(schedule.status)}
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
      </div>

      <RequestFoodDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}

export default SchoolDashboard