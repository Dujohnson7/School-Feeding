
import { useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Calendar, Clock, Package, ShoppingCart, User } from "lucide-react"
import PageHeader from "@/components/shared/page-header"

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