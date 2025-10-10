
import { useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Building2, DollarSign, Home, MapPinCheck, Users, FileText } from "lucide-react"
import PageHeader from "@/components/shared/page-header"

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
      value: "1,247",
      icon: Building2,
    },
    {
      title: "Students Fed Daily",
      value: "342,156",
      icon: Users,
    },
    {
      title: "Districts Covered",
      value: "30",
      icon: MapPinCheck,
    },
    {
      title: "Program Budget",
      value: "RWF 2.4B",
      icon: DollarSign,
    },
  ]

  const districts = [
    { name: "Kigali City", schools: 342, students: 156789, coverage: 98, budget: 450000000 },
    { name: "Eastern Province", schools: 678, students: 298456, coverage: 95, budget: 520000000 },
    { name: "Northern Province", schools: 523, students: 234567, coverage: 92, budget: 410000000 },
    { name: "Western Province", schools: 612, students: 267890, coverage: 94, budget: 480000000 },
    { name: "Southern Province", schools: 692, students: 287976, coverage: 96, budget: 580000000 },
  ]

  const nationalOverview = [
    { name: "Kigali City", value: 98 },
    { name: "Northern Province", value: 92 },
    { name: "Southern Province", value: 94 },
    { name: "Eastern Province", value: 95 },
    { name: "Western Province", value: 89 },
  ]

  const monthlyFoodDistribution = [
    { month: "Jan", tons: 120 },
    { month: "Feb", tons: 160 },
    { month: "Mar", tons: 180 },
    { month: "Apr", tons: 170 },
    { month: "May", tons: 150 },
    { month: "Jun", tons: 140 },
    { month: "Jul", tons: 165 },
    { month: "Aug", tons: 155 },
    { month: "Sep", tons: 175 },
    { month: "Oct", tons: 185 },
    { month: "Nov", tons: 190 },
    { month: "Dec", tons: 195 },
  ]

  const kpis = [
    { name: "Nutrition Standards Compliance", value: 96 },
    { name: "On-time Delivery Rate", value: 93 },
    { name: "Budget Utilization", value: 87 },
    { name: "School Participation", value: 99 },
    { name: "Supplier Performance", value: 91 },
  ]

  const alerts = [
    { title: "Budget Alert", desc: "Eastern Province exceeding budget", severity: "High" as const },
    { title: "Delivery Delay", desc: "15 schools affected in Kigali", severity: "Medium" as const },
    { title: "New Supplier", desc: "Application pending approval", severity: "Info" as const },
  ]

  const topDistricts = [
    { name: "Nyarugenge", meta: "42 schools, 98% efficiency", status: "Excellent" },
    { name: "Gasabo", meta: "58 schools, 97% efficiency", status: "Excellent" },
    { name: "Kicukiro", meta: "35 schools, 96% efficiency", status: "Excellent" },
    { name: "Rwamagana", meta: "28 schools, 95% efficiency", status: "Good" },
  ]

  const milestones = [
    { title: "Q1 Report Due", date: "Apr 30, 2025", days: 7 },
    { title: "Budget Review", date: "May 15, 2025", days: 22 },
    { title: "Supplier Evaluation", date: "Jun 1, 2025", days: 39 },
    { title: "Annual Conference", date: "Jul 20, 2025", days: 88 },
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
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <PageHeader
          title="Government Dashboard"
          homeTo="/gov-dashboard"
          HomeIcon={Home}
          profileTo="/gov-profile"
          userName="Government Official"
          userEmail="official@mineduc.gov.rw"
          avatarSrc="/userIcon.png"
          avatarFallback="GV"
        />

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
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* National Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>National Overview</CardTitle>
                  <CardDescription>School feeding program performance across Rwanda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-4">
                      {nationalOverview.map((p) => (
                        <div key={p.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{p.name}</p>
                            <span className="text-xs text-muted-foreground">{p.value}%</span>
                          </div>
                          <Progress value={p.value} className="h-2" />
                        </div>
                      ))}
                    </div>

                    {/* Monthly Food Distribution */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">Monthly Food Distribution (Tons)</p>
                      <div className="mt-2 flex h-40 items-end gap-2">
                        {monthlyFoodDistribution.map((m) => {
                          const h = Math.max(10, Math.min(100, (m.tons / 200) * 100))
                          return (
                            <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                              <div className="w-full rounded-t-sm bg-primary/90" style={{ height: `${h}%` }} />
                              <span className="text-[10px] text-muted-foreground">{m.month}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Performance Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>National program metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kpis.map((k) => (
                      <div key={k.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{k.name}</p>
                          <span className="text-xs text-muted-foreground">{k.value}%</span>
                        </div>
                        <Progress value={k.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>System notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((a, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 rounded-md border p-3">
                        <div>
                          <p className="text-sm font-medium leading-none">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </div>
                        <Badge
                          variant={
                            a.severity === "High" ? "destructive" : a.severity === "Medium" ? "secondary" : "outline"
                          }
                        >
                          {a.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Districts */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Districts</CardTitle>
                  <CardDescription>Districts with highest efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDistricts.map((d) => (
                      <div key={d.name} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="text-sm font-medium leading-none">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.meta}</p>
                        </div>
                        <Badge variant="default">{d.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>Important dates and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {milestones.map((m) => (
                      <div key={m.title} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="text-sm font-medium leading-none">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.date}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{m.days} days</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* District Performance & Recent Activities */}
            <div className="grid gap-6 md:grid-cols-2">
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
          </div>
        </main>
      </div>
    </div>
  )
}

export default GovDashboard
