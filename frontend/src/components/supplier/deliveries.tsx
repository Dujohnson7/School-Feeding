
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, CheckCircle, Clock, Filter, MapPin, Search, Truck, XCircle } from "lucide-react"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Delivery {
  id: string
  school: string
  address: string
  items: string[]
  quantities: string[]
  orderDate: string
  deliveryDate: string | null
  deliveryStatus: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED"
  orderPrice: number
  district: string
  contact: string
}

// Backend Order entity interface (same as orders.tsx)
interface BackendOrder {
  id?: string
  created?: string
  updated?: string
  requestItem?: {
    id?: string
    created?: string
    updated?: string
    description?: string
    requestStatus?: string
    school?: {
      id?: string
      name?: string
      address?: string
      email?: string
      phone?: string
      student?: number
      directorNames?: string
      district?: {
        id?: string
        province?: string
        district?: string
      }
    }
    district?: {
      id?: string
      province?: string
      district?: string
    }
    requestItemDetails?: Array<{
      id?: string
      quantity?: number
      item?: {
        id?: string
        name?: string
        perStudent?: number
        description?: string
      }
    }>
  }
  supplier?: {
    id?: string
    names?: string
    email?: string
    phone?: string
    companyName?: string
    items?: Array<{
      id?: string
      name?: string
      perStudent?: number
      description?: string
    }>
  }
  deliveryDate?: string | null
  deliveryStatus?: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED"
  orderPrice?: number
  orderPayState?: "PENDING" | "PAYED" | "CANCELLED"
  rating?: number
  [key: string]: any
}

const deliveryService = {
  getDelivery: async (id: string) => {
    const response = await apiClient.get(`/supplierDelivery/${id}`)
    return response.data
  },

  getAllDeliveries: async (supplierId: string) => {
    const response = await apiClient.get(`/supplierDelivery/all/${supplierId}`)
    return response.data
  },

  processOrder: async (id: string) => {
    const response = await apiClient.put(`/supplierDelivery/processOrder/${id}`)
    return response.data
  },

  deliveryOrder: async (id: string) => {
    const response = await apiClient.put(`/supplierDelivery/deliveryOrder/${id}`)
    return response.data
  },
}

// Helper function to map backend order to frontend delivery
const mapBackendOrderToDelivery = (backendOrder: BackendOrder): Delivery => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateString
    }
  }

  const mapDeliveryStatus = (deliveryStatus?: string): Delivery["deliveryStatus"] => {
    if (!deliveryStatus) return "SCHEDULED"
    const statusUpper = deliveryStatus.toUpperCase()
    if (statusUpper === "APPROVED") return "APPROVED"
    if (statusUpper === "SCHEDULED") return "SCHEDULED"
    if (statusUpper === "PROCESSING") return "PROCESSING"
    if (statusUpper === "DELIVERED") return "DELIVERED"
    if (statusUpper === "CANCELLED" || statusUpper === "CANCELED") return "CANCELLED"
    return "SCHEDULED"
  }

  // Extract items and quantities from requestItemDetails
  const requestItemDetails = backendOrder.requestItem?.requestItemDetails || []
  const items: string[] = []
  const quantities: string[] = []

  // Get item names from supplier's items array by matching IDs
  const supplierItems = backendOrder.supplier?.items || []
  const itemMap = new Map(supplierItems.map(item => [item.id, item.name]))

  requestItemDetails.forEach((detail) => {
    const itemId = detail.item?.id
    const itemName = itemId ? (itemMap.get(itemId) || `Item ${itemId}`) : "Unknown Item"
    const quantity = detail.quantity || 0
    
    items.push(itemName)
    quantities.push(`${quantity} kg`)
  })

  const school = backendOrder.requestItem?.school
  const district = backendOrder.requestItem?.district || backendOrder.requestItem?.school?.district

  return {
    id: backendOrder.id || "",
    school: school?.name || "Unknown School",
    address: school?.address || "Address not available",
    items: items.length > 0 ? items : ["No items"],
    quantities: quantities.length > 0 ? quantities : ["N/A"],
    orderDate: formatDate(backendOrder.created),
    deliveryDate: backendOrder.deliveryDate ?? null,
    deliveryStatus: mapDeliveryStatus(backendOrder.deliveryStatus),
    orderPrice: backendOrder.orderPrice || 0,
    district: district?.district || "Unknown",
    contact: school?.phone || school?.email || "+250 XXX XXX XXX",
  }
}

export function SupplierDeliveries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Fetch deliveries from API
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get supplier ID from localStorage (userId from login)
        const supplierId = localStorage.getItem("userId")

        if (!supplierId) {
          throw new Error("User ID not found. Please login again.")
        }

        const backendOrders: BackendOrder[] = await deliveryService.getAllDeliveries(supplierId)
        
        if (backendOrders && Array.isArray(backendOrders)) {
          const mappedDeliveries = backendOrders.map(mapBackendOrderToDelivery)
          setDeliveries(mappedDeliveries)
        } else {
          setDeliveries([])
        }
      } catch (err: any) {
        // Handle 404 as empty result (no deliveries found)
        if (err.response?.status === 404) {
          setDeliveries([])
          setError(null)
        } else {
          console.error("Error fetching deliveries:", err)
          const errorMessage = err.response?.data?.message || err.message || "Failed to fetch deliveries"
          setError(errorMessage)
          toast.error(errorMessage)
          setDeliveries([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  // Filter deliveries based on search term, status filter, and active tab
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || delivery.deliveryStatus.toLowerCase() === statusFilter.toLowerCase()

    const matchesTab =
      activeTab === "all" ||
      delivery.deliveryStatus.toUpperCase() === activeTab.toUpperCase()

    return matchesSearch && matchesStatus && matchesTab
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, activeTab])

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

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )
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
      case "DELIVERED":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "PROCESSING":
        return <Truck className="h-4 w-4 text-amber-600" />
      case "SCHEDULED":
      case "APPROVED":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleProcessOrder = async (deliveryId: string) => {
    try {
      setUpdatingStatus(deliveryId)
      await deliveryService.processOrder(deliveryId)
      toast.success("Delivery status updated to Processing")
      // Refresh deliveries
      const supplierId = localStorage.getItem("userId")
      if (supplierId) {
        const backendOrders: BackendOrder[] = await deliveryService.getAllDeliveries(supplierId)
        if (backendOrders && Array.isArray(backendOrders)) {
          const mappedDeliveries = backendOrders.map(mapBackendOrderToDelivery)
          setDeliveries(mappedDeliveries)
        }
      }
    } catch (err: any) {
      console.error("Error processing order:", err)
      toast.error(err.response?.data?.message || err.message || "Failed to update delivery status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeliverOrder = async (deliveryId: string) => {
    try {
      setUpdatingStatus(deliveryId)
      await deliveryService.deliveryOrder(deliveryId)
      toast.success("Delivery marked as Delivered")
      // Refresh deliveries
      const supplierId = localStorage.getItem("userId")
      if (supplierId) {
        const backendOrders: BackendOrder[] = await deliveryService.getAllDeliveries(supplierId)
        if (backendOrders && Array.isArray(backendOrders)) {
          const mappedDeliveries = backendOrders.map(mapBackendOrderToDelivery)
          setDeliveries(mappedDeliveries)
        }
      }
    } catch (err: any) {
      console.error("Error delivering order:", err)
      toast.error(err.response?.data?.message || err.message || "Failed to update delivery status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/supplier-dashboard" className="lg:hidden">
            <Truck className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Delivery Management</h1>
          </div>
          <HeaderActions role="supplier" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Deliveries</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Management</CardTitle>
                  <CardDescription>Track and manage all your deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search deliveries..."
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
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-24">
                      <p className="text-muted-foreground">Loading deliveries...</p>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-24">
                      <p className="text-destructive">{error}</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Delivery ID</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Delivery Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDeliveries.length > 0 ? (
                            paginatedDeliveries.map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell className="font-medium">{delivery.id}</TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="font-medium">{delivery.school}</p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      {delivery.address}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    <p className="text-sm">{delivery.items.join(", ")}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm">{delivery.orderDate}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {delivery.deliveryDate ? (
                                    <div className="flex items-center">
                                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                      <p className="text-sm">{new Date(delivery.deliveryDate).toLocaleDateString()}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Not delivered</p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(delivery.deliveryStatus)}
                                    {getStatusBadge(delivery.deliveryStatus)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {delivery.deliveryStatus === "SCHEDULED" && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleProcessOrder(delivery.id)}
                                        disabled={updatingStatus === delivery.id}
                                      >
                                        {updatingStatus === delivery.id ? "Processing..." : "Start Processing"}
                                      </Button>
                                    )}
                                    {delivery.deliveryStatus === "PROCESSING" && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleDeliverOrder(delivery.id)}
                                        disabled={updatingStatus === delivery.id}
                                      >
                                        {updatingStatus === delivery.id ? "Updating..." : "Mark Delivered"}
                                      </Button>
                                    )}
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedDelivery(delivery)
                                        setDetailsOpen(true)
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>Review the details of this delivery</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p>{selectedDelivery.orderDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">School</p>
                <p>{selectedDelivery.school}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{selectedDelivery.address}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p>{selectedDelivery.district}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p>{selectedDelivery.contact}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Price</p>
                  <p className="font-medium">{formatPrice(selectedDelivery.orderPrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Status</p>
                  <div className="mt-1">{getStatusBadge(selectedDelivery.deliveryStatus)}</div>
                </div>
              </div>

              {selectedDelivery.deliveryDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p>{new Date(selectedDelivery.deliveryDate).toLocaleString()}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Items</p>
                <div className="mt-1 space-y-1">
                  {selectedDelivery.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item}</span>
                      <span>{selectedDelivery.quantities[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Delivery Instructions</p>
                <p className="text-sm text-muted-foreground">
                  Deliver to the school kitchen entrance. Contact the school administrator or Stock keeper to confirm receive delivery.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setDetailsOpen(false)} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
