import { Link } from "react-router-dom"
import { Bell, Check, FileText, Home, LogOut, Package, School, Settings, Truck, User } from "lucide-react"

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

export function DistrictDashboard() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">District Coordinator</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/district-dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/district-approvals"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Check className="h-4 w-4" />
              Approvals
            </Link>
            <Link
              to="/manage-suppliers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Suppliers
            </Link>
            <Link
              to="/district-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/district-settings"
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
            <h1 className="text-lg font-semibold">District Dashboard</h1>
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
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">District Coordinator</p>
                    <p className="text-xs leading-none text-muted-foreground">coordinator@district.rw</p>
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
                <CardTitle className="text-sm font-medium">Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">In Nyarugenge District</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">3 high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">All operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Distributed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4t</div>
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
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Rice Stock</div>
                        <div className="text-sm text-muted-foreground">78%</div>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Beans Stock</div>
                        <div className="text-sm text-muted-foreground">65%</div>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Maize Stock</div>
                        <div className="text-sm text-muted-foreground">42%</div>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Vegetables Stock</div>
                        <div className="text-sm text-muted-foreground">25%</div>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-4 text-sm font-medium">Monthly Distribution</h3>
                    <div className="h-[200px] w-full bg-muted/50">
                      <div className="flex h-full items-end justify-between px-2">
                        <div className="h-[40%] w-[8%] bg-primary"></div>
                        <div className="h-[60%] w-[8%] bg-primary"></div>
                        <div className="h-[75%] w-[8%] bg-primary"></div>
                        <div className="h-[90%] w-[8%] bg-primary"></div>
                        <div className="h-[65%] w-[8%] bg-primary"></div>
                        <div className="h-[45%] w-[8%] bg-primary"></div>
                        <div className="h-[55%] w-[8%] bg-primary"></div>
                        <div className="h-[70%] w-[8%] bg-primary"></div>
                        <div className="h-[50%] w-[8%] bg-primary"></div>
                        <div className="h-[30%] w-[8%] bg-primary"></div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <div>Jan</div>
                      <div>Feb</div>
                      <div>Mar</div>
                      <div>Apr</div>
                      <div>May</div>
                      <div>Jun</div>
                      <div>Jul</div>
                      <div>Aug</div>
                      <div>Sep</div>
                      <div>Oct</div>
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
                  <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">Kigali Primary School</p>
                      <p className="text-sm text-muted-foreground">Rice, Beans - 200kg, 100kg</p>
                    </div>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">Nyamirambo Secondary School</p>
                      <p className="text-sm text-muted-foreground">Maize, Vegetables - 150kg, 50kg</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Medium
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">Remera High School</p>
                      <p className="text-sm text-muted-foreground">Rice, Oil - 100kg, 20L</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Low
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">Gasabo Elementary</p>
                      <p className="text-sm text-muted-foreground">Beans, Vegetables - 80kg, 40kg</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Medium
                    </Badge>
                  </div>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Scheduled food deliveries to schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Kigali Primary School</p>
                      <p className="text-sm text-muted-foreground">Rice, Beans - 200kg, 100kg</p>
                    </div>
                    <p className="text-sm">Apr 18, 2025</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nyamirambo Secondary School</p>
                      <p className="text-sm text-muted-foreground">Maize, Vegetables - 150kg, 50kg</p>
                    </div>
                    <p className="text-sm">Apr 19, 2025</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Remera High School</p>
                      <p className="text-sm text-muted-foreground">Rice, Oil - 100kg, 20L</p>
                    </div>
                    <p className="text-sm">Apr 20, 2025</p>
                  </div>
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
                      <div className="text-sm text-muted-foreground">1.2 days avg.</div>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">Delivery Accuracy</div>
                      <div className="text-sm text-muted-foreground">98.5%</div>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">School Satisfaction</div>
                      <div className="text-sm text-muted-foreground">92%</div>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">Budget Utilization</div>
                      <div className="text-sm text-muted-foreground">85%</div>
                    </div>
                    <Progress value={85} className="h-2" />
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