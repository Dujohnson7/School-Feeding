
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart3,
  Bell,
  Building2,
  DollarSign,
  Home,
  LogOut,
  Settings,
  TrendingUp,
  User,
  Users,
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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function GovDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    {
      title: "Total Schools",
      value: "2,847",
      change: "+12",
      changeType: "positive" as const,
      icon: Building2,
    },
    {
      title: "Students Fed Daily",
      value: "1,245,678",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Monthly Budget",
      value: "RWF 2.4B",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: DollarSign,
    },
    {
      title: "Program Coverage",
      value: "94.7%",
      change: "+1.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  const districts = [
    { name: "Kigali City", schools: 342, students: 156789, coverage: 98, budget: 450000000 },
    { name: "Eastern Province", schools: 678, students: 298456, coverage: 95, budget: 520000000 },
    { name: "Northern Province", schools: 523, students: 234567, coverage: 92, budget: 410000000 },
    { name: "Western Province", schools: 612, students: 267890, coverage: 94, budget: 480000000 },
    { name: "Southern Province", schools: 692, students: 287976, coverage: 96, budget: 580000000 },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "Budget allocation approved for Q2 2025",
      timestamp: "2 hours ago",
      type: "budget",
    },
    {
      id: 2,
      action: "New supplier registered in Eastern Province",
      timestamp: "4 hours ago",
      type: "supplier",
    },
    {
      id: 3,
      action: "Monthly nutrition report generated",
      timestamp: "6 hours ago",
      type: "report",
    },
    {
      id: 4,
      action: "District performance review completed",
      timestamp: "1 day ago",
      type: "review",
    },
  ]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">MINEDUC / RAB</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/gov-dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/gov-analytics"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              to="/gov-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/gov-settings"
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
            <h1 className="text-lg font-semibold">Government Dashboard</h1>
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
                    <AvatarFallback>GV</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Government Official</p>
                    <p className="text-xs leading-none text-muted-foreground">official@mineduc.gov.rw</p>
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
              {/* District Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>District Performance</CardTitle>
                  <CardDescription>Coverage and budget utilization by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districts.map((district, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{district.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {district.schools} schools • {district.students.toLocaleString()} students
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={district.coverage >= 95 ? "default" : "secondary"}>
                              {district.coverage}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={district.coverage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Generate National Report</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <DollarSign className="h-6 w-6" />
                    <span>Review Budget Allocation</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
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

export default GovDashboard
