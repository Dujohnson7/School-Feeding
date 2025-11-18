import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Calendar, Download, FileText, Home, LogOut, Search, Settings, Shield, Users, X } from "lucide-react"
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface User {
  id: string
  names: string
  role: string
  email: string 
}

interface AuditLog {
  id?: string
  timestamp: string
  user: User | null
  action: string
  resource: string
  details: string
  actionStatus: string
}

export function AdminAuditLogs() {
  const API_URL = "http://localhost:8070/api/audit"

  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
 
  const fetchAuditLogsList = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}`, errorText)
        throw new Error(`Failed to fetch audit logs: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setAuditLogsList(data)
    } catch (error: unknown) {
      console.error("Error fetching audit logs:", error) 
      if (process.env.NODE_ENV !== 'production' && 
          error instanceof Error && 
          error.message?.includes('Failed to fetch')) {
        console.warn('Amplitude analytics error (safe to ignore in development)')
      } else { 
        console.error('Failed to load audit logs. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogsList()
  }, [])

  const filteredLogs = auditLogsList.filter((log) => {
    const searchLower = searchTerm.toLowerCase()
    const userName = log.user?.names || 'System'
    const userRole = log.user?.role || 'SYSTEM'
    const logDate = new Date(log.timestamp)
    
    const isInDateRange = !dateRange?.from || !dateRange?.to || 
      (logDate >= dateRange.from && logDate <= new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000 - 1))
    
    const matchesSearch =
      userName.toLowerCase().includes(searchLower) ||
      userRole.toLowerCase().includes(searchLower) ||
      log.action?.toLowerCase().includes(searchLower) ||
      log.resource?.toLowerCase().includes(searchLower) ||
      log.details?.toLowerCase().includes(searchLower)
 
    const matchesAction = selectedAction === "all" || log.action === selectedAction
     
    const statusToCheck = log.actionStatus?.toLowerCase() || ''
    const statusMatch = selectedStatus === "all" || 
                       (selectedStatus === "success" && statusToCheck === "success") ||
                       (selectedStatus === "failed" && (statusToCheck === "failed" || statusToCheck === "failure"))

    return isInDateRange && matchesSearch && matchesAction && statusMatch
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedAction, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  const getStatusBadge = (actionStatus?: string | null) => {
    if (!actionStatus) {
      return <Badge variant="outline">Unknown</Badge>;
    }
    
    const statusLower = actionStatus.toLowerCase();
    switch (statusLower) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "failure":
      case "fail":
        return <Badge variant="destructive">Fail</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{actionStatus}</Badge>;
    }
  }


  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
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

    return (
      <Badge className={colors[action.toUpperCase()] || "bg-gray-100 text-gray-800"}>
        {action}
      </Badge>
    )
  }

  const getResourceBadge = (resource: string) => {
    const resourceLower = resource?.toLowerCase() || '';
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800",
      district: "bg-blue-100 text-blue-800",
      gov: "bg-green-100 text-green-800",
      government: "bg-green-100 text-green-800",
      school: "bg-yellow-100 text-yellow-800",
      stock: "bg-orange-100 text-orange-800",
      supplier: "bg-indigo-100 text-indigo-800",
    };

    const resourceType = Object.keys(colors).find(key => 
      resourceLower.includes(key)
    ) || 'default';

    return (
      <Badge className={colors[resourceType] || "bg-gray-100 text-gray-800"}>
        {resource}
      </Badge>
    );
  };

  const getDetailsBadge = (details: string) => {
    if (!details) return details;
    
    const detailsLower = details.toLowerCase();
    
    if (detailsLower.includes('success')) {
      return <span className="text-black font-medium">{details}</span>;
    }
    
    if (detailsLower.includes('fail') || detailsLower.includes('error')) {
      return <span className="text-red-600 font-medium">{details}</span>;
    }
    
    return details;
  };

  const handleExportPDF = async () => {
    try { 
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });

      doc.setFontSize(18);
      doc.text('Audit Logs Report', 14, 20);
      
      doc.setFontSize(10);
      const dateRangeText = `Date Range: ${dateRange?.from ? format(dateRange.from, 'PPP') : 'Start date'} to ${dateRange?.to ? format(dateRange.to, 'PPP') : 'End date'}`;
      doc.text(dateRangeText, 14, 30);
      doc.text(`Generated on: ${format(new Date(), 'PPPppp')}`, 14, 35);

      const tableData = filteredLogs.map(log => ({
        timestamp: format(new Date(log.timestamp), 'PPpp'),
        user: log.user?.names || 'System',
        role: log.user?.role || 'SYSTEM',
        action: log.action,
        resource: log.resource,
        details: log.details,
        status: log.actionStatus
      }));

      autoTable(doc, {
        head: [['Timestamp', 'User', 'Role', 'Action', 'Resource', 'Details', 'Status']],
        body: tableData.map(item => [
          item.timestamp,
          item.user,
          item.role,
          item.action,
          item.resource,
          item.details,
          item.status
        ]),
        startY: 45,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246] },
        didDrawPage: function (data) {
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(
            `Page ${data.pageCount} of ${data.pageCount}`, 
            data.settings.margin.left, 
            pageHeight - 10
          );
        }
      });

      doc.save(`audit-logs-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading audit logs...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Link to="/admin-dashboard" className="lg:hidden">
          <Shield className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold">Audit Logs</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/userIcon.png" alt="Avatar" />
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="flex flex-col gap-4 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
              <div className="space-y-1">
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription className="hidden sm:block">Track all system activities and changes</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search logs..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap">
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="LOGIN">Login</SelectItem>
                      <SelectItem value="LOGOUT">Logout</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Select Date Range</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => setShowDatePicker(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setDateRange({
                                from: subDays(new Date(), 30),
                                to: new Date(),
                              })
                            }}
                          >
                            Last 30 Days
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              handleExportPDF();
                              setShowDatePicker(false);
                            }}
                            disabled={!dateRange?.from || !dateRange?.to}
                          >
                            Export
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <Table className="min-w-[800px] md:min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead className="hidden md:table-cell">Resource</TableHead>
                        <TableHead className="hidden lg:table-cell">Details</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLogs.length > 0 ? (
                        paginatedLogs.map((log) => (
                          <TableRow key={log.id} className="group">
                            <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="font-medium">{log.user?.names || 'System'}</div>
                              <div className="text-xs text-muted-foreground sm:hidden">{log.user?.role || 'SYSTEM'}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{log.user?.role || 'SYSTEM'}</TableCell>
                            <TableCell className="whitespace-nowrap">{getActionBadge(log.action)}</TableCell>
                            <TableCell className="hidden md:table-cell">{getResourceBadge(log.resource)}</TableCell>
                            <TableCell className="hidden lg:table-cell max-w-[200px] overflow-hidden text-ellipsis">
                              {getDetailsBadge(log.details)}
                            </TableCell>
                            <TableCell>{getStatusBadge(log.actionStatus)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No audit logs found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium hidden sm:block">Rows per page</p>
                  <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 50, 100].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Pagination className="w-full sm:w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) setPage(page - 1)
                        }}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNum = i + 1; 
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                              }}
                              isActive={page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (pageNum === 2 && page > 3) {
                        return <PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>;
                      }
                      if (pageNum === totalPages - 1 && page < totalPages - 2) {
                        return <PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < totalPages) setPage(page + 1)
                        }}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
