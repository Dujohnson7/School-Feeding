import { useState } from "react"
import { Link } from "react-router-dom"

import { Calendar, FileText, Home, Shield, Users } from "lucide-react"
import PageHeader from "@/components/shared/page-header"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <PageHeader
          title="System Administration"
          homeTo="/admin-dashboard"
          HomeIcon={Shield}
          profileTo="/admin-profile"
          userName="System Admin"
          userEmail="admin@sf.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="SA"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">432</div>
                <p className="text-xs text-muted-foreground">+4 new schools this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 high priority</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Database Storage</div>
                            <div className="text-sm text-muted-foreground">65%</div>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">API Usage</div>
                            <div className="text-sm text-muted-foreground">42%</div>
                          </div>
                          <Progress value={42} className="h-2" />
                        </div>
                      </div>

                      <div className="rounded-md bg-muted p-4">
                        <div className="font-medium">System Notifications</div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Database backup completed successfully</span>
                            <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                            <span>System update scheduled for tonight</span>
                            <span className="ml-auto text-xs text-muted-foreground">5h ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>New district added to the system</span>
                            <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="analytics" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">User Logins</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1,853</div>
                            <p className="text-xs text-muted-foreground">This week</p>
                            <div className="mt-4 h-[80px] w-full bg-muted/50">
                              <div className="flex h-full items-end justify-between px-1">
                                <div className="h-[30%] w-[8%] bg-primary"></div>
                                <div className="h-[40%] w-[8%] bg-primary"></div>
                                <div className="h-[45%] w-[8%] bg-primary"></div>
                                <div className="h-[60%] w-[8%] bg-primary"></div>
                                <div className="h-[70%] w-[8%] bg-primary"></div>
                                <div className="h-[50%] w-[8%] bg-primary"></div>
                                <div className="h-[35%] w-[8%] bg-primary"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">API Requests</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">42.5k</div>
                            <p className="text-xs text-muted-foreground">This week</p>
                            <div className="mt-4 h-[80px] w-full bg-muted/50">
                              <div className="flex h-full items-end justify-between px-1">
                                <div className="h-[60%] w-[8%] bg-primary"></div>
                                <div className="h-[70%] w-[8%] bg-primary"></div>
                                <div className="h-[80%] w-[8%] bg-primary"></div>
                                <div className="h-[50%] w-[8%] bg-primary"></div>
                                <div className="h-[65%] w-[8%] bg-primary"></div>
                                <div className="h-[45%] w-[8%] bg-primary"></div>
                                <div className="h-[55%] w-[8%] bg-primary"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reports" className="pt-4">
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <div className="p-4">
                          <h3 className="font-medium">Recent Reports</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Monthly System Usage Report</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                            <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">User Activity Summary</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                            <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Security Audit Report</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1 h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">User account created</p>
                      <p className="text-xs text-muted-foreground">John Doe (School Admin) was added to the system</p>
                      <p className="mt-1 text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1 h-8 w-8">
                      <AvatarFallback className="bg-amber-500 text-primary-foreground">SY</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">System settings updated</p>
                      <p className="text-xs text-muted-foreground">Sarah Yusuf modified payment gateway settings</p>
                      <p className="mt-1 text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1 h-8 w-8">
                      <AvatarFallback className="bg-green-500 text-primary-foreground">MK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Database backup</p>
                      <p className="text-xs text-muted-foreground">Automated system backup completed successfully</p>
                      <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1 h-8 w-8">
                      <AvatarFallback className="bg-blue-500 text-primary-foreground">RN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">New district added</p>
                      <p className="text-xs text-muted-foreground">Robert Niyonzima added Nyarugenge district</p>
                      <p className="mt-1 text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard