import { Link } from "react-router-dom"
import {
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Home,
  LogOut,
  Package,
  Settings,
  Truck,
  TrendingUp,
  User,
  FileText,
} from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function SupplierDashboard() {
  const stats = [
    {
      title: "Active Orders",
      value: "24",
      change: "+3",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Monthly Revenue",
      value: "RWF 45.2M",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Delivery Rate",
      value: "98.5%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Truck,
    },
    {
      title: "Customer Rating",
      value: "4.8/5",
      change: "+0.2",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  const recentOrders = [
    {
      id: "ORD-2025-156",
      school: "Kigali Primary School",
      items: "Rice, Beans, Cooking Oil",
      quantity: "500kg, 200kg, 50L",
      deliveryDate: "2025-04-15",
      status: "pending",
      amount: "RWF 850,000",
    },
    {
      id: "ORD-2025-155",
      school: "Nyamirambo Secondary",
      items: "Maize Flour, Salt, Sugar",
      quantity: "300kg, 25kg, 100kg",
      deliveryDate: "2025-04-14",
      status: "delivered",
      amount: "RWF 420,000",
    },
    {
      id: "ORD-2025-154",
      school: "Remera High School",
      items: "Fresh Vegetables, Meat",
      quantity: "150kg, 80kg",
      deliveryDate: "2025-04-13",
      status: "in-transit",
      amount: "RWF 320,000",
    },
    {
      id: "ORD-2025-153",
      school: "Gasabo Primary",
      items: "Milk, Bread, Eggs",
      quantity: "200L, 500 loaves, 1000 pieces",
      deliveryDate: "2025-04-12",
      status: "delivered",
      amount: "RWF 180,000",
    },
  ]

  const upcomingDeliveries = [
    {
      id: "DEL-2025-089",
      school: "Kigali Primary School",
      date: "2025-04-15",
      time: "08:00 AM",
      items: "Rice, Beans, Cooking Oil",
      status: "scheduled",
    },
    {
      id: "DEL-2025-090",
      school: "Nyarugenge Secondary",
      date: "2025-04-16",
      time: "09:30 AM",
      items: "Maize Flour, Vegetables",
      status: "scheduled",
    },
    {
      id: "DEL-2025-091",
      school: "Kimisagara Primary",
      date: "2025-04-17",
      time: "10:00 AM",
      items: "Fresh Meat, Spices",
      status: "scheduled",
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
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">Supplier Portal</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/supplier-dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/supplier-orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
            <Link
              to="/supplier-deliveries"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Deliveries
            </Link>
            <Link
              to="/supplier-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/supplier-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link href="#" className="lg:hidden">
            <Home className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Supplier Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Fresh Foods Ltd</p>
                    <p className="text-xs leading-none text-muted-foreground">supplier@freshfoods.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                        {stat.change}
                      </span>{" "}
                      from last month
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
                    {recentOrders.slice(0, 4).map((order) => (
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
                    ))}
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
                    {upcomingDeliveries.map((delivery) => (
                      <div key={delivery.id} className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{delivery.school}</p>
                          <p className="text-xs text-muted-foreground">{delivery.items}</p>
                          <p className="text-xs text-muted-foreground">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {delivery.date} at {delivery.time}
                          </p>
                        </div>
                        <div className="text-right">{getStatusBadge(delivery.status)}</div>
                      </div>
                    ))}
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
                      <span className="text-sm text-muted-foreground">98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quality Rating</span>
                      <span className="text-sm text-muted-foreground">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Order Fulfillment</span>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
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
