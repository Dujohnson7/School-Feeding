
import { useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Bell, Calendar, Clock, Home, LogOut, Package, Settings, ShoppingCart, User } from "lucide-react"

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

export function SchoolDashboard() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">School Feeding</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/school-dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/request-food"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              Request Food
            </Link>
            <Link
              to="/track-delivery"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Track Delivery
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/settings"
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
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">School Admin Dashboard</h1>
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
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">School Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@school.rw</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Stock Level</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <FoodStockGauge value={65} />
                <p className="text-xs text-muted-foreground text-center mt-2">Current stock level: Medium</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="destructive">High Priority: 1</Badge>
                  <Badge variant="outline">Normal: 2</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tomorrow</div>
                <p className="text-xs text-muted-foreground">April 8, 2025 - 10:00 AM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Fed Today</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">Out of 250 registered</p>
                <Progress value={98} className="mt-2" />
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
                  <div className="grid grid-cols-4 items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Apr 5, 2025</span>
                    </div>
                    <div>Rice, Beans, Vegetables</div>
                    <div>Kigali Foods Ltd</div>
                    <div>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Apr 1, 2025</span>
                    </div>
                    <div>Maize, Potatoes, Fruits</div>
                    <div>Rwanda Harvest Co.</div>
                    <div>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Mar 28, 2025</span>
                    </div>
                    <div>Rice, Beans, Oil</div>
                    <div>Kigali Foods Ltd</div>
                    <div>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Mar 25, 2025</span>
                    </div>
                    <div>Vegetables, Fruits</div>
                    <div>Fresh Farms Rwanda</div>
                    <div>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Mar 21, 2025</span>
                    </div>
                    <div>Rice, Beans, Vegetables</div>
                    <div>Rwanda Harvest Co.</div>
                    <div>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </div>
                  </div>
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
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Food Delivery</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                    <Badge className="ml-auto">Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Lunch Serving</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 12:30 PM</p>
                    </div>
                    <Badge className="ml-auto">Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Inventory Check</p>
                      <p className="text-sm text-muted-foreground">Apr 10, 2025, 9:00 AM</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Monthly Report Due</p>
                      <p className="text-sm text-muted-foreground">Apr 30, 2025, 5:00 PM</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Upcoming
                    </Badge>
                  </div>
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