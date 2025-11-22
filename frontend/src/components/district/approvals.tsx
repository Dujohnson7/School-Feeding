
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Check, Filter, LogOut, Package, Search, Settings, User, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = "http://localhost:8070/api/respondDistrict"

interface ApiRequestItem {
  id: string
  requestStatus: string
  requestItemDetails: Array<{
    id: string
    item: { id: string; name?: string }
    quantity: number
  }>
  description: string
  created: string
  updated?: string
  school?: {
    id: string
    name?: string
    school?: string
  }
}

interface Item {
  id: string
  name: string
  category?: string
  unit?: string
}

interface Supplier {
  id: string
  name?: string
  companyName?: string
  user?: {
    id: string
    name?: string
    email?: string
  }
}

interface Request {
  id: string
  school: string
  items: string
  quantity: string
  requestDate: string 
  status: "pending" | "approved" | "rejected"
  description?: string
}

export function DistrictApprovals() {
  const [searchTerm, setSearchTerm] = useState("")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [assignOrderDialogOpen, setAssignOrderDialogOpen] = useState(false)
  const [pendingApprovalRequest, setPendingApprovalRequest] = useState<Request | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("")
  const [orderPrice, setOrderPrice] = useState<string>("")
  const [assignLoading, setAssignLoading] = useState(false)

  // Fetch items to map IDs to names
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8070/api/item/all")
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (err) {
        console.error("Error fetching items:", err)
      }
    }
    fetchItems()
  }, [])

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8070/api/supplier/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          const data = await response.json()
          setSuppliers(data)
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err)
      }
    }
    fetchSuppliers()
  }, [])

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      const districtId = localStorage.getItem("districtId")
      const token = localStorage.getItem("token")

      if (!districtId || !token) {
        setLoading(false)
        toast({
          title: "Error",
          description: "District ID or authentication token not found. Please login again.",
          variant: "destructive",
        })
        return
      }

      try {
        setLoading(true)
        let url = ""
        
        // If status filter is set and not "all", use the filtered endpoint
        if (statusFilter !== "all") {
          // Map frontend status to backend enum values
          const statusMap: Record<string, string> = {
            pending: "PENDING",
            approved: "COMPLETED",
            rejected: "REJECTED",
          }
          const requestStatus = statusMap[statusFilter] || "PENDING"
          url = `${API_BASE_URL}/districtRequestByRequestStatus?dId=${districtId}&requestStatus=${requestStatus}`
        } else {
          url = `${API_BASE_URL}/districtRequest/${districtId}`
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data: ApiRequestItem[] = await response.json()

        // Transform API data to frontend Request format
        const transformedRequests = transformApiData(data)
        setRequests(transformedRequests)
      } catch (err) {
        console.error("Error fetching requests:", err)
        toast({
          title: "Error",
          description: "Failed to load food requests. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (items.length > 0 || statusFilter !== "all") {
      fetchRequests()
    }
  }, [items, statusFilter])

  // Filter requests based on search term and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.items.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, urgencyFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + pageSize)

  const canPrev = page > 1
  const canNext = page < totalPages

  const getPageWindow = () => {
    const maxButtons = 5
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, page - half)
    let end = Math.min(totalPages, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const handleApprove = async (request: Request) => {
    // Open assign order dialog instead of directly approving
    setPendingApprovalRequest(request)
    setAssignOrderDialogOpen(true)
    setDetailsOpen(false)
  }

  const handleAssignOrder = async () => {
    if (!pendingApprovalRequest || !selectedSupplierId || !orderPrice) {
      toast({
        title: "Error",
        description: "Please select a supplier and enter an order price.",
        variant: "destructive",
      })
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please login again.",
        variant: "destructive",
      })
      return
    }

    try {
      setAssignLoading(true)
      
      // First approve the request
      const approveResponse = await fetch(`${API_BASE_URL}/approval/${pendingApprovalRequest.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Handle response that might be JSON or plain text
      let approveData: any
      const contentType = approveResponse.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        approveData = await approveResponse.json()
      } else {
        const text = await approveResponse.text()
        approveData = text ? { message: text } : {}
      }

      if (!approveResponse.ok) {
        throw new Error(approveData?.message || approveData || "Failed to approve request")
      }

      // Then assign order to supplier
      const assignResponse = await fetch("http://localhost:8070/api/respondDistrict/assignOrder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestItem: { id: pendingApprovalRequest.id },
          supplier: { id: selectedSupplierId },
          orderPrice: parseFloat(orderPrice),
        }),
      })

      // Handle response that might be JSON or plain text
      let assignData: any
      const assignContentType = assignResponse.headers.get("content-type")
      if (assignContentType && assignContentType.includes("application/json")) {
        assignData = await assignResponse.json()
      } else {
        const text = await assignResponse.text()
        assignData = text ? { message: text } : {}
      }

      if (!assignResponse.ok) {
        throw new Error(assignData?.message || assignData || "Failed to assign order")
      }

      toast({
        title: "Success",
        description: "Request approved and order assigned to supplier successfully.",
      })

      setAssignOrderDialogOpen(false)
      setPendingApprovalRequest(null)
      setSelectedSupplierId("")
      setOrderPrice("")
      await refreshRequests()
    } catch (err: any) {
      console.error("Error assigning order:", err)
      toast({
        title: "Error",
        description: err?.message || "Failed to assign order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAssignLoading(false)
    }
  }

  const handleReject = async (request: Request) => {
    const token = localStorage.getItem("token")

    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please login again.",
        variant: "destructive",
      })
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/reject/${request.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || data || "Failed to reject request")
      }

      toast({
        title: "Success",
        description: "Request rejected successfully.",
      })

      setDetailsOpen(false)
      await refreshRequests()
    } catch (err: any) {
      console.error("Error rejecting request:", err)
      toast({
        title: "Error",
        description: err?.message || "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Helper function to transform API data to frontend format
  const transformApiData = (data: ApiRequestItem[]): Request[] => {
    return data.map((request) => {
      const requestItems = request.requestItemDetails.map((detail) => {
        const item = items.find((i) => i.id === detail.item.id)
        const itemName = item?.name || detail.item.name || `Item ${detail.item.id.substring(0, 8)}`
        const unit = item?.unit || "kg"
        return {
          name: itemName,
          quantity: detail.quantity,
          unit: unit,
        }
      })

      const itemsString = requestItems.map((i) => i.name).join(", ")
      const quantityString = requestItems.map((i) => `${i.quantity}${i.unit}`).join(", ")

      // Map backend status to frontend status
      const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
        PENDING: "pending",
        COMPLETED: "approved",
        REJECTED: "rejected",
      }
      const frontendStatus = statusMap[request.requestStatus] || "pending"

      // Format date
      const date = new Date(request.created)
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      return {
        id: request.id,
        school: request.school?.name || request.school?.school || "Unknown School",
        items: itemsString,
        quantity: quantityString,
        requestDate: formattedDate,
        status: frontendStatus,
        description: request.description,
      }
    })
  }

  // Helper function to refresh requests after approve/reject
  const refreshRequests = async () => {
    const districtId = localStorage.getItem("districtId")
    const token = localStorage.getItem("token")

    if (!districtId || !token) return

    try {
      const refreshUrl = statusFilter !== "all" 
        ? `${API_BASE_URL}/districtRequestByRequestStatus?dId=${districtId}&requestStatus=${statusFilter === "pending" ? "PENDING" : statusFilter === "approved" ? "COMPLETED" : "REJECTED"}`
        : `${API_BASE_URL}/districtRequest/${districtId}`
      
      const refreshResponse = await fetch(refreshUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (refreshResponse.ok) {
        const refreshData: ApiRequestItem[] = await refreshResponse.json()
        const transformedRequests = transformApiData(refreshData)
        setRequests(transformedRequests)
      }
    } catch (err) {
      console.error("Error refreshing requests:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "approved":
        return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Food Request Approvals</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Food Requests</CardTitle>
              <CardDescription>Review and approve food requests from schools in your district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by school, request ID, or items..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Filter:</span>
                  </div>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Urgency</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading requests...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length > 0 ? (
                      paginatedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.school}</TableCell>
                          <TableCell>{request.items}</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request)
                                setDetailsOpen(true)
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No requests found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredRequests.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredRequests.length)} of {filteredRequests.length}
                  </span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => { e.preventDefault(); if (canPrev) setPage((p) => p - 1) }}
                        className={!canPrev ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => { e.preventDefault(); setPage(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNext) setPage((p) => p + 1) }}
                        className={!canNext ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>Review the details of this food request</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Request ID</p>
                  <p className="font-medium">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedRequest.requestDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">School</p>
                <p>{selectedRequest.school}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Items</p>
                  <p>{selectedRequest.items}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p>{selectedRequest.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div> 
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Additional Notes</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.description || "No additional notes provided."}
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              {selectedRequest.status === "pending" ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedRequest)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedRequest)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Order Dialog */}
      {pendingApprovalRequest && (
        <Dialog open={assignOrderDialogOpen} onOpenChange={setAssignOrderDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Order to Supplier</DialogTitle>
              <DialogDescription>
                Assign the approved request to a supplier. The request will be approved and the order will be created.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.companyName || supplier.name || supplier.user?.name || `Supplier ${supplier.id.substring(0, 8)}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-suppliers" disabled>
                        No suppliers available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orderPrice">Order Price (RWF) *</Label>
                <Input
                  id="orderPrice"
                  type="number"
                  placeholder="Enter order price"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium mb-2">Request Information</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Request ID:</span> {pendingApprovalRequest.id}</p>
                  <p><span className="font-medium">School:</span> {pendingApprovalRequest.school}</p>
                  <p><span className="font-medium">Items:</span> {pendingApprovalRequest.items}</p>
                  <p><span className="font-medium">Quantity:</span> {pendingApprovalRequest.quantity}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAssignOrderDialogOpen(false)
                  setPendingApprovalRequest(null)
                  setSelectedSupplierId("")
                  setOrderPrice("")
                }}
                disabled={assignLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssignOrder}
                disabled={assignLoading || !selectedSupplierId || !orderPrice}
              >
                {assignLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Approve & Assign Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
