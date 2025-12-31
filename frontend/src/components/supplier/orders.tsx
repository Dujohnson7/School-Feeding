
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, Search } from "lucide-react"
import { supplierService } from "./service/supplierService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Order {
  id: string
  school: string
  items: string[]
  quantities: string[]
  orderDate: string
  orderPrice: number
  orderPayState: "PENDING" | "PAYED" | "CANCELLED"
  deliveryStatus: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED"
  district: string
  contact: string
}

// Backend Order entity interface (based on Spring Boot entity)
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
  [key: string]: any // Allow for additional fields from backend
}

// Local service definition removed

// Helper function to map backend order to frontend order
const mapBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateString
    }
  }

  const mapPayState = (orderPayState?: string): Order["orderPayState"] => {
    if (!orderPayState) return "PENDING"
    const stateUpper = orderPayState.toUpperCase()
    if (stateUpper === "PAYED" || stateUpper === "PAID") return "PAYED"
    if (stateUpper === "CANCELLED" || stateUpper === "CANCELED") return "CANCELLED"
    return "PENDING"
  }

  const mapDeliveryStatus = (deliveryStatus?: string): Order["deliveryStatus"] => {
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
    items: items.length > 0 ? items : ["No items"],
    quantities: quantities.length > 0 ? quantities : ["N/A"],
    orderDate: formatDate(backendOrder.created),
    orderPrice: backendOrder.orderPrice || 0,
    orderPayState: mapPayState(backendOrder.orderPayState),
    deliveryStatus: mapDeliveryStatus(backendOrder.deliveryStatus),
    district: district?.district || "Unknown",
    contact: school?.phone || school?.email || "+250 XXX XXX XXX",
  }
}

export function SupplierOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get supplier ID from localStorage (userId from login)
        const supplierId = localStorage.getItem("userId")

        if (!supplierId) {
          throw new Error("User ID not found. Please login again.")
        }

        const backendOrders: BackendOrder[] = await supplierService.getAllOrders(supplierId)

        if (backendOrders && Array.isArray(backendOrders)) {
          const mappedOrders = backendOrders.map(mapBackendOrderToFrontend)
          setOrders(mappedOrders)
        } else {
          setOrders([])
        }
      } catch (err: any) {
        // Handle 404 as empty result (no orders found)
        if (err.response?.status === 404) {
          setOrders([])
          setError(null)
        } else {
          console.error("Error fetching orders:", err)
          const errorMessage = err.response?.data?.message || err.message || "Failed to fetch orders"
          setError(errorMessage)
          toast.error(errorMessage)
          setOrders([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term, status filter, and active tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.orderPayState.toLowerCase() === statusFilter.toLowerCase()

    const isActive =
      activeTab === "active"
        ? ["PENDING"].includes(order.orderPayState)
        : ["PAYED", "CANCELLED"].includes(order.orderPayState)

    return matchesSearch && matchesStatus && isActive
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, activeTab])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize)

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


  const getPayStateBadge = (payState: string) => {
    switch (payState.toUpperCase()) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "PAYED":
      case "PAID":
        return <Badge className="bg-green-600 hover:bg-green-700">Payed</Badge>
      case "CANCELLED":
      case "CANCELED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDeliveryStatusBadge = (status: string) => {
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

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/supplier-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Order Management</h1>
          </div>
          <HeaderActions role="supplier" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage and track your food delivery orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by school, order ID, or items..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="payed">Payed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <p className="text-muted-foreground">Loading orders...</p>
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
                        <TableHead>Order ID</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Order Price</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Delivery Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.school}</TableCell>
                            <TableCell>{order.items.join(", ")}</TableCell>
                            <TableCell>{order.orderDate}</TableCell>
                            <TableCell>{formatPrice(order.orderPrice)}</TableCell>
                            <TableCell>{getPayStateBadge(order.orderPayState)}</TableCell>
                            <TableCell>{getDeliveryStatusBadge(order.deliveryStatus)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order)
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
                          <TableCell colSpan={8} className="h-24 text-center">
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
                    Showing {filteredOrders.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredOrders.length)} of {filteredOrders.length}
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

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Review the details of this order</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p>{selectedOrder.orderDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">School</p>
                <p>{selectedOrder.school}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p>{selectedOrder.district}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p>{selectedOrder.contact}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Price</p>
                  <p className="font-medium">{formatPrice(selectedOrder.orderPrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <div className="mt-1">{getPayStateBadge(selectedOrder.orderPayState)}</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Status</p>
                <div className="mt-1">{getDeliveryStatusBadge(selectedOrder.deliveryStatus)}</div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Items</p>
                <div className="mt-1 space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item}</span>
                      <span>{selectedOrder.quantities[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Delivery Instructions</p>
                <p className="text-sm text-muted-foreground">
                  Deliver to the school kitchen entrance. Contact the school administrator or Stock keeper to confirm recieve delivery.
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
