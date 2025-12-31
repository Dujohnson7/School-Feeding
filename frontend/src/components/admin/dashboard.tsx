import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"

import { Calendar, Home, Shield, Users } from "lucide-react"
import PageHeader from "@/components/shared/page-header"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"

import { adminService, AuditLog as Audit, User } from "./service/adminService"
 

export function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalSchools, setTotalSchools] = useState<number>(0)
  const [totalDistricts, setTotalDistricts] = useState<number>(0)
  const [pendingRequests, setPendingRequests] = useState<number>(0)
  const [recentAudits, setRecentAudits] = useState<Audit[]>([])
  const [totalLoginsThisWeek, setTotalLoginsThisWeek] = useState<number>(0)
  const [loginsPerDay, setLoginsPerDay] = useState<number[]>(new Array(7).fill(0))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const parseNumber = (value: any): number => {
          if (value === null || value === undefined) return 0
          if (typeof value === 'string') {
            const trimmed = value.trim()
            const num = Number(trimmed)
            return isNaN(num) ? 0 : num
          }
          const num = Number(value)
          return isNaN(num) ? 0 : num
        }

        let users = 0
        let schools = 0
        let districts = 0
        let requests = 0
        let audits: Audit[] = []
        let logins = 0
        let loginsPerDayData: any = []

        try {
          users = parseNumber(await adminDashboardService.getTotalUsers())
        } catch (error) {
          console.error("Error fetching total users:", error)
        }

        try {
          schools = parseNumber(await adminService.getTotalSchools())
        } catch (error) {
          console.error("Error fetching total schools:", error)
        }

        try {
          districts = parseNumber(await adminService.getTotalDistricts())
        } catch (error) {
          console.error("Error fetching total districts:", error)
        }

        try {
          requests = parseNumber(await adminService.getTotalPendingRequests())
        } catch (error) {
          console.error("Error fetching pending requests:", error)
        }

        try {
          const auditsData = await adminService.getTop4Audits()
          audits = Array.isArray(auditsData) ? auditsData : []
        } catch (error) {
          console.error("Error fetching audits:", error)
        }

        try {
          logins = parseNumber(await adminService.getTotalUserLoginThisWeek())
        } catch (error) {
          console.error("Error fetching logins:", error)
        }

        try {
          loginsPerDayData = await adminService.getCountLoginsPerDayOfWeek()
        } catch (error: any) {
          // Silently handle backend errors for this endpoint - chart will display with zero values
          loginsPerDayData = []
        }

        setTotalUsers(users)
        setTotalSchools(schools)
        setTotalDistricts(districts)
        setPendingRequests(requests)
        setRecentAudits(audits)
        setTotalLoginsThisWeek(logins)

        // Process logins per day data
        // Assuming the data comes as [[dayOfWeek, count], ...] where dayOfWeek is 1-7 (Monday-Sunday)
        if (Array.isArray(loginsPerDayData)) {
          const dayCounts = new Array(7).fill(0)
          loginsPerDayData.forEach((item: any) => {
            if (Array.isArray(item) && item.length >= 2) {
              const dayOfWeek = Number(item[0])
              const count = Number(item[1]) || 0
              // Convert 1-7 (Monday-Sunday) to 0-6 array index
              const dayIndex = dayOfWeek - 1
              if (dayIndex >= 0 && dayIndex < 7 && !isNaN(dayIndex)) {
                dayCounts[dayIndex] = count
              }
            } else if (typeof item === 'object' && item !== null) {
              // Handle object format like {dayOfWeek: 1, count: 5}
              const dayOfWeek = Number(item.dayOfWeek || item.day || item[0])
              const count = Number(item.count || item.value || item[1]) || 0
              const dayIndex = dayOfWeek - 1
              if (dayIndex >= 0 && dayIndex < 7 && !isNaN(dayIndex)) {
                dayCounts[dayIndex] = count
              }
            }
          })
          setLoginsPerDay(dayCounts)
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        if (error.response) {
          console.error("Response error:", error.response.status, error.response.data)
        } else if (error.request) {
          console.error("Request error:", error.request)
        } else {
          console.error("Error message:", error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getInitials = (user: User | null): string => {
    if (!user) return "SY"
    if (user.names) {
      const names = user.names.split(" ")
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return names[0].substring(0, 2).toUpperCase()
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "SY"
  }

  const formatTimestamp = (timestamp: string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "Recently"
    }
  }

  const getMaxLoginCount = (): number => {
    const max = Math.max(...loginsPerDay)
    return max > 0 ? max : 1
  }

  const getBarHeight = (count: number): string => {
    const max = getMaxLoginCount()
    const height = max > 0 ? (count / max) * 100 : 0
    // Ensure minimum height of 5% for visibility when count is 0
    return `${Math.max(height, count > 0 ? 5 : 0)}%`
  }

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
                <div className="text-2xl font-bold">
                  {loading ? "..." : totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Active users in the system</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : totalSchools.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Schools registered in the system</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Districts</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : totalDistricts.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Districts in the system</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : pendingRequests.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Requests awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                  </TabsList>
                  <TabsContent value="overview" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-1">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">User Logins</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {loading ? "..." : totalLoginsThisWeek.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">This week</p>
                            <div className="mt-4 h-[80px] w-full bg-muted/50 rounded">
                              <div className="flex h-full items-end justify-between px-1">
                                {loginsPerDay.map((count, index) => (
                                  <div
                                    key={index}
                                    className="w-[8%] bg-primary rounded-t transition-all"
                                    style={{ height: getBarHeight(count) }}
                                    title={`${count} logins`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                              <span>Mon</span>
                              <span>Tue</span>
                              <span>Wed</span>
                              <span>Thu</span>
                              <span>Fri</span>
                              <span>Sat</span>
                              <span>Sun</span>
                            </div>
                          </CardContent>
                        </Card>
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Loading activities...</p>
                  </div>
                ) : recentAudits.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">No recent activities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAudits.map((audit) => {
                      const initials = getInitials(audit.user)
                      const colors = [
                        "bg-primary",
                        "bg-amber-500",
                        "bg-green-500",
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-pink-500",
                      ]
                      const colorIndex = initials.charCodeAt(0) % colors.length
                      const bgColor = colors[colorIndex]

                      return (
                        <div key={audit.id || Math.random()} className="flex items-start gap-4">
                          <Avatar className="mt-1 h-8 w-8">
                            <AvatarFallback className={`${bgColor} text-primary-foreground`}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{audit.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {audit.details || `${audit.resource} - ${audit.action}`}
                              {audit.user && ` by ${audit.user.names || audit.user.email}`}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatTimestamp(audit.timestamp)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin-logs">View All Activities</Link>
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