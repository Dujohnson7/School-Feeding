
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Check, Filter, Package, Search, X, Loader2, FileText } from "lucide-react"
import { districtService } from "./service/districtService"
import { generateDistrictReport } from "@/utils/export-utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeaderActions } from "@/components/shared/header-actions"
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
import { toast } from "sonner"

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
  const [expectedDate, setExpectedDate] = useState<string>("")
  const [assignLoading, setAssignLoading] = useState(false)

  // Fetch items to map IDs to names
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await districtService.getAllItems()
        setItems(data)
      } catch (err) {
        console.error("Error fetching items:", err)
      }
    }
    fetchItems()
  }, [])

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      const districtId = localStorage.getItem("districtId")
      if (!districtId) return

      try {
        const data = await districtService.getSuppliersByDistrict(districtId)
        setSuppliers(data)
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

      if (!districtId) {
        setLoading(false)
        toast.error("District ID not found. Please login again.")
        return
      }

      try {
        setLoading(true)
        let data: ApiRequestItem[] = []

        // If status filter is set and not "all", use the filtered endpoint
        if (statusFilter !== "all") {
          // Map frontend status to backend enum values
          const statusMap: Record<string, string> = {
            pending: "PENDING",
            approved: "APPROVE",
            rejected: "REJECTED",
          }
          const requestStatus = statusMap[statusFilter] || "PENDING"
          data = await districtService.getRequestsByStatus(districtId, requestStatus)
        } else {
          data = await districtService.getAllRequests(districtId)
        }

        // Transform API data to frontend Request format
        const transformedRequests = transformApiData(data)
        setRequests(transformedRequests)
      } catch (err) {
        console.error("Error fetching requests:", err)
        toast.error("Failed to load food requests. Please refresh the page.")
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
  }, [searchTerm, statusFilter])

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
    if (!pendingApprovalRequest || !selectedSupplierId || !orderPrice || !expectedDate) {
      toast.error("Please fill in all required fields (Supplier, Price, Expected Date).")
      return
    }

    try {
      setAssignLoading(true)

      // First approve the request
      await districtService.approveRequest(pendingApprovalRequest.id)

      // Then assign order to supplier
      await districtService.assignOrder({
        requestItem: { id: pendingApprovalRequest.id },
        supplier: { id: selectedSupplierId },
        orderPrice: parseFloat(orderPrice),
        expectedDate: expectedDate
      })

      toast.success("Request approved and order assigned to supplier successfully.")

      setAssignOrderDialogOpen(false)
      setPendingApprovalRequest(null)
      setSelectedSupplierId("")
      setOrderPrice("")
      setExpectedDate("")
      await refreshRequests()
    } catch (err: any) {
      console.error("Error assigning order:", err)
      toast.error(err?.message || "Failed to assign order. Please try again.")
    } finally {
      setAssignLoading(false)
    }
  }

  const handleReject = async (request: Request) => {
    try {
      setActionLoading(true)
      await districtService.rejectRequest(request.id)

      toast.success("Request rejected successfully.")

      setDetailsOpen(false)
      await refreshRequests()
    } catch (err: any) {
      console.error("Error rejecting request:", err)
      toast.error(err?.message || "Failed to reject request. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const dataForReport = filteredRequests.map((req) => ({
        "Request ID": req.id,
        "School Name": req.school,
        "Requested Items": req.items,
        "Quantity": req.quantity,
        "Date": req.requestDate,
        "Status": req.status.charAt(0).toUpperCase() + req.status.slice(1),
      }))

      await generateDistrictReport(
        "Food Request Approvals",
        { from: undefined, to: undefined },
        "pdf",
        dataForReport
      )
      toast.success("PDF report generated successfully.")
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast.error("Failed to generate PDF report.")
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
        APPROVE: "approved",
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

    if (!districtId) return

    try {
      let refreshData: ApiRequestItem[] = []

      if (statusFilter !== "all") {
        const requestStatus = statusFilter === "pending" ? "PENDING" : statusFilter === "approved" ? "APPROVE" : "REJECTED"
        refreshData = await districtService.getRequestsByStatus(districtId, requestStatus)
      } else {
        refreshData = await districtService.getAllRequests(districtId)
      }
      const transformedRequests = transformApiData(refreshData)
      setRequests(transformedRequests)
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
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Food Request Approvals</h1>
          </div>
          <HeaderActions role="district" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
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
                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-4 w-4" />
                    Export
                  </Button>
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
                          <TableCell className="font-medium">{request.id.substring(0, 8)}</TableCell>
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
                  <p className="font-medium">{selectedRequest.id.substring(0, 8)}</p>
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
                Assign the approved request to a supplier.
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

              <div>
                <Label htmlFor="expectedDate">Expected Delivery Date *</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
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
                  setExpectedDate("")
                }}
                disabled={assignLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignOrder}
                disabled={assignLoading || !selectedSupplierId || !orderPrice || !expectedDate}
              >
                {assignLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Assign Order
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
