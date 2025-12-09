
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Check, Filter, Package, Plus, Search, X, Eye, Star } from "lucide-react"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Order {
  id?: string
  created?: string
  updated?: string
  deliveryDate?: string
  deliveryStatus?: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED"
  orderPrice?: number
  orderPayState?: string
  rating?: number
  supplier?: {
    id?: string
    companyName?: string
    names?: string
    items?: Array<{
      id?: string
      name?: string
      unit?: string
      price?: number
    }>
  }
  requestItem?: {
    id?: string
    description?: string
    requestStatus?: string
    requestItemDetails?: Array<{
      id?: string
      quantity?: number
      item?: {
        id?: string
        name?: string
        unit?: string
      }
    }>
  }
}

const receivingService = {
  getAllReceiving: async (schoolId: string) => {
    const response = await apiClient.get(`/receiving/all/${schoolId}`)
    return response.data
  },

  receiveOrder: async (id: string, rating: number) => {
    const response = await apiClient.put(`/receiving/receivingOrder/${id}?rating=${rating}`)
    return response.data
  },
}

export function StockReceiving() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<Order | null>(null)
  const [deliveries, setDeliveries] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false)
  const [newDeliveryOpen, setNewDeliveryOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [rating, setRating] = useState(0)

  // Fetch deliveries on component mount
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true)
        setError(null)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) {
          setError("School ID not found")
          return
        }
        const data = await receivingService.getAllReceiving(schoolId)
        setDeliveries(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching deliveries:", err)
        if (err.response?.status === 404) {
          setDeliveries([])
          setError(null)
        } else {
          setError(err.response?.data || "Failed to fetch deliveries")
          toast.error("Failed to load deliveries")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Helper function to get item name from supplier items array
  const getItemName = (order: Order, itemId?: string) => {
    if (!itemId || !order.supplier?.items) return "N/A"
    const item = order.supplier.items.find(i => i.id === itemId)
    return item?.name || "N/A"
  }

  // Helper function to get item unit from supplier items array
  const getItemUnit = (order: Order, itemId?: string) => {
    if (!itemId || !order.supplier?.items) return "kg"
    const item = order.supplier.items.find(i => i.id === itemId)
    return item?.unit || "kg"
  }

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = (Array.isArray(deliveries) ? deliveries : []).filter((delivery) => {
    const supplierName = delivery.supplier?.companyName || delivery.supplier?.names || ""
    const deliveryId = delivery.id || ""
    const items = delivery.requestItem?.requestItemDetails?.map(d => getItemName(delivery, d.item?.id)).join(" ") || ""

    const matchesSearch =
      supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.toLowerCase().includes(searchTerm.toLowerCase())

    const deliveryStatus = delivery.deliveryStatus?.toUpperCase() || ""
    const matchesStatus = statusFilter === "all" || deliveryStatus === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDeliveries.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + pageSize)

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

  const handleReceiveDelivery = async () => {
    if (!selectedDelivery || !selectedDelivery.id) return
    if (rating === 0) {
      toast.error("Please provide a rating before receiving the order")
      return
    }

    try {
      setIsProcessing(true)
      await receivingService.receiveOrder(selectedDelivery.id, rating)
      
      // Refresh the list
      const schoolId = localStorage.getItem("schoolId")
      if (schoolId) {
        const data = await receivingService.getAllReceiving(schoolId)
        setDeliveries(Array.isArray(data) ? data : [])
      }
      
      toast.success("Order received successfully")
      setReceiveDialogOpen(false)
      setSelectedDelivery(null)
      setRating(0)
    } catch (err: any) {
      console.error("Error receiving order:", err)
      toast.error(err.response?.data || "Failed to receive order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading deliveries</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const handleCreateDelivery = () => {
    // In a real app, this would create a new delivery record
    console.log("Creating new delivery")
    setNewDeliveryOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const deliveryStatus = status?.toUpperCase() || ""
    switch (deliveryStatus) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        )
      case "PROCESSING":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Processing
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Approved
          </Badge>
        )
      case "DELIVERED":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
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
          <Link to="/stock-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Receiving Management</h1>
          </div>
          <HeaderActions role="stock" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Incoming Deliveries</CardTitle>
                  <CardDescription>Manage and receive incoming food deliveries</CardDescription>
                </div> 
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by supplier, ID, or order number..."
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
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.length > 0 ? (
                      paginatedDeliveries.map((delivery) => {
                        const deliveryStatus = delivery.deliveryStatus?.toUpperCase() || ""
                        // Show Receive button for SCHEDULED and PROCESSING (not APPROVED or DELIVERED)
                        const canReceive = deliveryStatus === "SCHEDULED" || deliveryStatus === "PROCESSING"
                        
                        return (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{delivery.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{delivery.supplier?.companyName || delivery.supplier?.names || "N/A"}</TableCell>
                            <TableCell>
                              {delivery.requestItem?.requestItemDetails && delivery.requestItem.requestItemDetails.length > 0 ? (
                                delivery.requestItem.requestItemDetails.map((detail, index) => (
                                  <div key={index} className="text-sm">
                                    {getItemName(delivery, detail.item?.id)} ({detail.quantity || 0} {getItemUnit(delivery, detail.item?.id)})
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No items</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(delivery.deliveryDate || delivery.created)}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(deliveryStatus)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDelivery(delivery)
                                    setViewDetailsDialogOpen(true)
                                  }}
                                  disabled={isProcessing}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                                {canReceive && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDelivery(delivery)
                                      setRating(0)
                                      setReceiveDialogOpen(true)
                                    }}
                                    disabled={isProcessing}
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Receive
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {deliveries.length === 0 ? "No delivery found" : "No deliveries found matching your search."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredDeliveries.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredDeliveries.length)} of {filteredDeliveries.length}
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

      {/* View Details Dialog */}
      {selectedDelivery && (
        <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>View complete information about this delivery order</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedDelivery.deliveryStatus || "")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedDelivery.supplier?.companyName || selectedDelivery.supplier?.names || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p>{formatDate(selectedDelivery.deliveryDate || selectedDelivery.created)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Price</p>
                  <p className="font-medium">{selectedDelivery.orderPrice ? `RWF ${selectedDelivery.orderPrice.toLocaleString()}` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <p>{selectedDelivery.orderPayState || "N/A"}</p>
                </div>
              </div>

              {selectedDelivery.rating && selectedDelivery.rating > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Rating</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < selectedDelivery.rating!
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({selectedDelivery.rating}/5)</span>
                  </div>
                </div>
              )}

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Order Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDelivery.requestItem?.requestItemDetails && selectedDelivery.requestItem.requestItemDetails.length > 0 ? (
                        selectedDelivery.requestItem.requestItemDetails.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{getItemName(selectedDelivery, detail.item?.id)}</TableCell>
                            <TableCell>{detail.quantity || 0}</TableCell>
                            <TableCell>{getItemUnit(selectedDelivery, detail.item?.id)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedDelivery.requestItem?.description && (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.requestItem.description}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Receive Delivery Dialog */}
      {selectedDelivery && (
        <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Receive Delivery</DialogTitle>
              <DialogDescription>Verify and receive incoming delivery items. Please rate the supplier before confirming receipt.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedDelivery.supplier?.companyName || selectedDelivery.supplier?.names || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p>{formatDate(selectedDelivery.deliveryDate || selectedDelivery.created)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Price</p>
                  <p className="font-medium">{selectedDelivery.orderPrice ? `RWF ${selectedDelivery.orderPrice.toLocaleString()}` : "N/A"}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Order Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Expected Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDelivery.requestItem?.requestItemDetails && selectedDelivery.requestItem.requestItemDetails.length > 0 ? (
                        selectedDelivery.requestItem.requestItemDetails.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{getItemName(selectedDelivery, detail.item?.id)}</TableCell>
                            <TableCell>{detail.quantity || 0}</TableCell>
                            <TableCell>{getItemUnit(selectedDelivery, detail.item?.id)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rate Supplier *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-300 text-gray-300 hover:fill-amber-200 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Click on a star to rate the supplier for this delivery</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this delivery"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => {
                setReceiveDialogOpen(false)
                setRating(0)
              }}>
                Cancel
              </Button>
              <Button onClick={handleReceiveDelivery} disabled={isProcessing || rating === 0}>
                <Check className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Confirm Receipt"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Delivery Dialog */}
      <Dialog open={newDeliveryOpen} onOpenChange={setNewDeliveryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Delivery</DialogTitle>
            <DialogDescription>Create a record for an expected delivery</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-number">Order Number</Label>
                <Input id="order-number" placeholder="e.g., ORD-2025-043" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-date">Expected Date</Label>
                <Input id="expected-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kigali-foods">Kigali Foods Ltd</SelectItem>
                  <SelectItem value="fresh-farms">Fresh Farms Rwanda</SelectItem>
                  <SelectItem value="rwanda-harvest">Rwanda Harvest Co.</SelectItem>
                  <SelectItem value="nyabihu-dairy">Nyabihu Dairy Products</SelectItem>
                  <SelectItem value="eastern-grains">Eastern Grains Suppliers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="beans">Beans</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="oil">Oil</SelectItem>
                        <SelectItem value="milk">Milk</SelectItem>
                      </SelectContent>
                      </Select>
                    </div>
                    <Input placeholder="Quantity" className="w-24" />
                    <div className="w-24">
                      <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="pcs">pcs</SelectItem>
                      </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any notes about this delivery" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDeliveryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDelivery}>Create Delivery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
