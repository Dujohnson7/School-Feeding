
import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, Package, ShoppingBag, TrendingDown, TrendingUp, Truck } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StockDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
                <div className="text-2xl font-bold">4,280 kg</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>12% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Low in Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center text-xs text-amber-500">
                  <span>Vegetables, Oil, Salt</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Incoming Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Next: Tomorrow, 10:00 AM</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <div className="flex items-center text-xs text-red-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Milk: 5 days left</span>
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
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Rice</div>
                          <div className="text-sm text-muted-foreground">1,200 kg (80%)</div>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Beans</div>
                          <div className="text-sm text-muted-foreground">850 kg (65%)</div>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Maize</div>
                          <div className="text-sm text-muted-foreground">950 kg (70%)</div>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Vegetables</div>
                          <div className="text-sm text-muted-foreground">120 kg (20%)</div>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Oil</div>
                          <div className="text-sm text-muted-foreground">80 L (25%)</div>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Salt</div>
                          <div className="text-sm text-muted-foreground">30 kg (15%)</div>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Milk</div>
                          <div className="text-sm text-muted-foreground">50 L (45%)</div>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
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
                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Rice Received</p>
                            <p className="text-sm text-muted-foreground">200 kg from Kigali Foods Ltd</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Today, 9:30 AM</p>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <ArrowUp className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Beans Distributed</p>
                            <p className="text-sm text-muted-foreground">50 kg to Kitchen</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Today, 8:15 AM</p>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Vegetables Received</p>
                            <p className="text-sm text-muted-foreground">80 kg from Fresh Farms Rwanda</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Yesterday, 2:45 PM</p>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <ArrowUp className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Rice Distributed</p>
                            <p className="text-sm text-muted-foreground">75 kg to Kitchen</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Yesterday, 11:30 AM</p>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <ArrowUp className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Maize Distributed</p>
                            <p className="text-sm text-muted-foreground">60 kg to Kitchen</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Apr 14, 2025</p>
                      </div>
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
                      <div className="flex items-center justify-between rounded-md bg-red-50 p-3">
                        <div>
                          <p className="font-medium">Milk</p>
                          <p className="text-sm text-muted-foreground">50 L - Batch #M2025-042</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">5 days left</Badge>
                          <p className="mt-1 text-xs text-muted-foreground">Apr 20, 2025</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-amber-50 p-3">
                        <div>
                          <p className="font-medium">Vegetables</p>
                          <p className="text-sm text-muted-foreground">120 kg - Batch #V2025-038</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            12 days left
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">Apr 27, 2025</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                        <div>
                          <p className="font-medium">Oil</p>
                          <p className="text-sm text-muted-foreground">80 L - Batch #O2025-035</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            28 days left
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">May 13, 2025</p>
                        </div>
                      </div>
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
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center text-xs text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "65%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">3,950kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "70%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">4,050kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "62%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">3,900kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "58%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">3,800kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "75%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">4,150kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "72%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">4,100kg</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-[120px] w-full bg-muted/50">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 w-full bg-primary" style={{ height: "78%" }}></div>
                          </div>
                        </div>
                        <div className="text-center text-xs">4,280kg</div>
                      </div>
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
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Receive Rice Delivery</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                    <Badge className="ml-auto">High</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Inventory Count</p>
                      <p className="text-sm text-muted-foreground">Apr 18, 2025, 2:00 PM</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Medium
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Rotate Milk Stock</p>
                      <p className="text-sm text-muted-foreground">Apr 19, 2025, 9:00 AM</p>
                    </div>
                    <Badge variant="destructive" className="ml-auto">
                      Urgent
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <TrendingDown className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Order Vegetables</p>
                      <p className="text-sm text-muted-foreground">Apr 20, 2025, 10:00 AM</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Medium
                    </Badge>
                  </div>
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