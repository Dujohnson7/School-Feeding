
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, Package, ShoppingBag, TrendingDown, TrendingUp, Truck } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StockStats {
  totalInventory: string
  itemsLowInStock: number
  lowStockItems: string
  incomingDeliveries: number
  nextDeliveryTime: string
  itemsExpiringSoon: number
  expiringItem: string
  expiringDays: number
}

interface StockLevel {
  itemName: string
  currentQuantity: string
  percentage: number
}

interface StockMovement {
  id: string
  type: "in" | "out"
  itemName: string
  quantity: string
  source: string
  timestamp: string
}

interface ExpiringItem {
  itemName: string
  quantity: string
  batchNumber: string
  expiryDate: string
  daysLeft: number
}

interface WeeklyTrend {
  day: string
  value: number
}

interface UpcomingTask {
  id: string
  title: string
  date: string
  time: string
  priority: "High" | "Medium" | "Urgent"
}

export function StockDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StockStats>({
    totalInventory: "0 kg",
    itemsLowInStock: 0,
    lowStockItems: "",
    incomingDeliveries: 0,
    nextDeliveryTime: "",
    itemsExpiringSoon: 0,
    expiringItem: "",
    expiringDays: 0,
  })
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [activeTab])

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
      const statsResponse = await apiClient.get(`/stock/dashboard/stats?schoolId=${schoolId}`)
      if (statsResponse.data) {
        setStats(statsResponse.data)
      }

      // Fetch stock levels
      const stockLevelsResponse = await apiClient.get(`/stock/dashboard/stock-levels?schoolId=${schoolId}`)
      if (stockLevelsResponse.data) {
        setStockLevels(stockLevelsResponse.data)
      }

      // Fetch stock movements
      if (activeTab === "movement") {
        const movementsResponse = await apiClient.get(`/stock/dashboard/movements?schoolId=${schoolId}&limit=5`)
        if (movementsResponse.data) {
          setStockMovements(movementsResponse.data)
        }
      }

      // Fetch expiring items
      if (activeTab === "expiry") {
        const expiringResponse = await apiClient.get(`/stock/dashboard/expiring-items?schoolId=${schoolId}`)
        if (expiringResponse.data) {
          setExpiringItems(expiringResponse.data)
        }
      }

      // Fetch weekly trend
      const trendResponse = await apiClient.get(`/stock/dashboard/weekly-trend?schoolId=${schoolId}`)
      if (trendResponse.data) {
        setWeeklyTrend(trendResponse.data)
      }

      // Fetch upcoming tasks
      const tasksResponse = await apiClient.get(`/stock/dashboard/upcoming-tasks?schoolId=${schoolId}`)
      if (tasksResponse.data) {
        setUpcomingTasks(tasksResponse.data)
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <PageHeader
          title="Stock Keeper Dashboard"
          homeTo="/stock-dashboard"
          HomeIcon={Package}
          profileTo="/stock-profile"
          userName="Stock Keeper"
          userEmail="stockkeeper@school.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="SK"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalInventory}</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>{loading ? "Loading..." : "12% from last month"}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Low in Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.itemsLowInStock}</div>
                <div className="flex items-center text-xs text-amber-500">
                  <span>{loading ? "Loading..." : stats.lowStockItems || "No items low in stock"}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Incoming Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.incomingDeliveries}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{loading ? "Loading..." : stats.nextDeliveryTime || "No upcoming deliveries"}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.itemsExpiringSoon}</div>
                <div className="flex items-center text-xs text-red-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {loading
                      ? "Loading..."
                      : stats.itemsExpiringSoon > 0
                        ? `${stats.expiringItem}: ${stats.expiringDays} days left`
                        : "No items expiring soon"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Stock Overview</TabsTrigger>
                <TabsTrigger value="movement">Stock Movement</TabsTrigger>
                <TabsTrigger value="expiry">Expiry Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Stock Levels</CardTitle>
                    <CardDescription>Inventory levels of major food items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading && stockLevels.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading stock levels...</div>
                      ) : stockLevels.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No stock data available</div>
                      ) : (
                        stockLevels.map((stock, index) => (
                          <div key={index}>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="text-sm font-medium">{stock.itemName}</div>
                              <div className="text-sm text-muted-foreground">
                                {stock.currentQuantity} ({stock.percentage}%)
                              </div>
                            </div>
                            <Progress value={stock.percentage} className="h-2" />
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Link to="/stock-inventory" className="flex w-full items-center justify-center">
                        View Full Inventory
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="movement" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Stock Movement</CardTitle>
                    <CardDescription>Incoming and outgoing stock in the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading && stockMovements.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading movements...</div>
                      ) : stockMovements.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No stock movements</div>
                      ) : (
                        stockMovements.map((movement) => (
                          <div key={movement.id} className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                  movement.type === "in" ? "bg-green-100" : "bg-red-100"
                                }`}
                              >
                                {movement.type === "in" ? (
                                  <ArrowDown className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowUp className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {movement.itemName} {movement.type === "in" ? "Received" : "Distributed"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {movement.quantity} {movement.type === "in" ? `from ${movement.source}` : `to ${movement.source}`}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{movement.timestamp}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Link to="/stock-receiving">Receiving Log</Link>
                    </Button>
                    <Button variant="outline">
                      <Link to="/stock-distribution">Distribution Log</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="expiry" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Expiry Tracking</CardTitle>
                    <CardDescription>Items that will expire within 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading && expiringItems.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Loading expiring items...</div>
                      ) : expiringItems.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No items expiring soon</div>
                      ) : (
                        expiringItems.map((item, index) => {
                          const bgColor = item.daysLeft <= 7 ? "bg-red-50" : item.daysLeft <= 14 ? "bg-amber-50" : "bg-muted/50"
                          const badgeVariant =
                            item.daysLeft <= 7
                              ? "destructive"
                              : item.daysLeft <= 14
                                ? "outline"
                                : "outline"
                          const badgeClass =
                            item.daysLeft <= 7
                              ? ""
                              : item.daysLeft <= 14
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"

                          return (
                            <div key={index} className={`flex items-center justify-between rounded-md ${bgColor} p-3`}>
                              <div>
                                <p className="font-medium">{item.itemName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} - Batch #{item.batchNumber}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant={badgeVariant} className={badgeClass}>
                                  {item.daysLeft} days left
                                </Badge>
                                <p className="mt-1 text-xs text-muted-foreground">{item.expiryDate}</p>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Generate FIFO Distribution Plan</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Stock Trend</CardTitle>
                <CardDescription>Stock levels over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <div className="flex h-full flex-col justify-between">
                    <div className="grid grid-cols-7 gap-2">
                      {loading && weeklyTrend.length === 0
                        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <div key={day} className="text-center text-xs text-muted-foreground">
                              {day}
                            </div>
                          ))
                        : weeklyTrend.map((trend) => (
                            <div key={trend.day} className="text-center text-xs text-muted-foreground">
                              {trend.day}
                            </div>
                          ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {loading && weeklyTrend.length === 0 ? (
                        <div className="col-span-7 text-center text-sm text-muted-foreground">Loading trend data...</div>
                      ) : weeklyTrend.length === 0 ? (
                        <div className="col-span-7 text-center text-sm text-muted-foreground">No trend data available</div>
                      ) : (
                        weeklyTrend.map((trend, index) => {
                          const maxValue = Math.max(...weeklyTrend.map(t => t.value), 5000)
                          const height = (trend.value / maxValue) * 100
                          return (
                            <div key={index} className="space-y-2">
                              <div className="h-[120px] w-full bg-muted/50">
                                <div className="relative h-full w-full">
                                  <div
                                    className="absolute bottom-0 w-full bg-primary"
                                    style={{ height: `${Math.max(10, height)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-center text-xs">{trend.value}kg</div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && upcomingTasks.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Loading tasks...</div>
                  ) : upcomingTasks.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No upcoming tasks</div>
                  ) : (
                    upcomingTasks.map((task) => {
                      const badgeVariant =
                        task.priority === "Urgent" || task.priority === "High"
                          ? task.priority === "Urgent"
                            ? "destructive"
                            : "default"
                          : "outline"
                      return (
                        <div key={task.id} className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Truck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.date} {task.time ? `, ${task.time}` : ""}
                            </p>
                          </div>
                          <Badge variant={badgeVariant} className="ml-auto">
                            {task.priority}
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StockDashboard