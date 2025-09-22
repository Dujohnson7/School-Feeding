
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Download, FileText, Home, LogOut, Search, Settings, Shield, Users } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  userRole: string
  action: string
  resource: string
  details: string
  ipAddress: string
  status: "success" | "failed" | "warning"
}

export function AdminAuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const [logs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-01-30 14:30:25",
      user: "Jean Baptiste Uwimana",
      userRole: "School Administrator",
      action: "CREATE",
      resource: "Food Request",
      details: "Created food request for 500 students",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-30 14:25:10",
      user: "Marie Claire Mukamana",
      userRole: "District Coordinator",
      action: "APPROVE",
      resource: "Food Request",
      details: "Approved food request #FR-2024-001",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-30 14:20:45",
      user: "System Admin",
      userRole: "System Administrator",
      action: "UPDATE",
      resource: "User Account",
      details: "Updated user permissions for Sarah Yusuf",
      ipAddress: "192.168.1.1",
      status: "success",
    },
    {
      id: "4",
      timestamp: "2024-01-30 14:15:30",
      user: "Robert Niyonzima",
      userRole: "Government Official",
      action: "LOGIN",
      resource: "System",
      details: "User logged into the system",
      ipAddress: "192.168.1.102",
      status: "success",
    },
    {
      id: "5",
      timestamp: "2024-01-30 14:10:15",
      user: "Unknown User",
      userRole: "Unknown",
      action: "LOGIN",
      resource: "System",
      details: "Failed login attempt with invalid credentials",
      ipAddress: "192.168.1.200",
      status: "failed",
    },
    {
      id: "6",
      timestamp: "2024-01-30 14:05:00",
      user: "David Mugisha",
      userRole: "Stock Manager",
      action: "UPDATE",
      resource: "Inventory",
      details: "Updated stock levels for rice inventory",
      ipAddress: "192.168.1.103",
      status: "success",
    },
    {
      id: "7",
      timestamp: "2024-01-30 14:00:45",
      user: "Sarah Yusuf",
      userRole: "Supplier",
      action: "CREATE",
      resource: "Delivery",
      details: "Created delivery record for order #ORD-2024-001",
      ipAddress: "192.168.1.104",
      status: "success",
    },
    {
      id: "8",
      timestamp: "2024-01-30 13:55:30",
      user: "System",
      userRole: "System",
      action: "BACKUP",
      resource: "Database",
      details: "Automated database backup completed",
      ipAddress: "127.0.0.1",
      status: "success",
    },
    {
      id: "9",
      timestamp: "2024-01-30 13:50:15",
      user: "Grace Uwimana",
      userRole: "Parent",
      action: "PAYMENT",
      resource: "School Fees",
      details: "Payment failed due to insufficient funds",
      ipAddress: "192.168.1.105",
      status: "failed",
    },
    {
      id: "10",
      timestamp: "2024-01-30 13:45:00",
      user: "Jean Baptiste Uwimana",
      userRole: "School Administrator",
      action: "DELETE",
      resource: "User Account",
      details: "Attempted to delete system administrator account",
      ipAddress: "192.168.1.100",
      status: "warning",
    },
  ])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
    return matchesSearch && matchesAction && matchesStatus
  })

  const handleExportLogs = () => {
    console.log("Exporting audit logs...")
    // Implementation for exporting logs
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    const colors = {
      CREATE: "bg-blue-100 text-blue-800",
      UPDATE: "bg-orange-100 text-orange-800",
      DELETE: "bg-red-100 text-red-800",
      LOGIN: "bg-green-100 text-green-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      APPROVE: "bg-purple-100 text-purple-800",
      REJECT: "bg-red-100 text-red-800",
      PAYMENT: "bg-indigo-100 text-indigo-800",
      BACKUP: "bg-teal-100 text-teal-800",
    }

    return <Badge className={colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{action}</Badge>
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">System Admin</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/admin-users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              User Management
            </Link>
            <Link
              to="/admin-logs"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Audit Logs
            </Link>
            <Link
              to="/admin-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              System Settings
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
            <Shield className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Audit Logs</h1>
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
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">System Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@system.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
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
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Audit Logs</h2>
                <p className="text-muted-foreground">Monitor all system activities and user actions</p>
              </div>
              <Button onClick={handleExportLogs}>
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action</label>
                    <Select value={selectedAction} onValueChange={setSelectedAction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="CREATE">Create</SelectItem>
                        <SelectItem value="UPDATE">Update</SelectItem>
                        <SelectItem value="DELETE">Delete</SelectItem>
                        <SelectItem value="LOGIN">Login</SelectItem>
                        <SelectItem value="LOGOUT">Logout</SelectItem>
                        <SelectItem value="APPROVE">Approve</SelectItem>
                        <SelectItem value="REJECT">Reject</SelectItem>
                        <SelectItem value="PAYMENT">Payment</SelectItem>
                        <SelectItem value="BACKUP">Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>System Logs ({filteredLogs.length})</CardTitle>
                <CardDescription>Complete audit trail of all system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-sm text-muted-foreground">{log.userRole}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
