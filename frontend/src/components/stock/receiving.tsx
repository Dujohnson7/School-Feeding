
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Calendar, Check, Filter, LogOut, Package, Plus, Search, Settings, User, X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

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
  supplier?: {
    id?: string
    companyName?: string
    names?: string
  }
  requestItem?: {
    id?: string
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

const API_BASE_URL = "http://localhost:8070/api/receiving"

const receivingService = {
  getAllReceiving: async (schoolId: string) => {
    const response = await axios.get(`${API_BASE_URL}/all/${schoolId}`)
    return response.data
  },

  receiveOrder: async (id: string) => {
    const response = await axios.put(`${API_BASE_URL}/receivingOrder/${id}`)
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
  const [newDeliveryOpen, setNewDeliveryOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

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

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = (Array.isArray(deliveries) ? deliveries : []).filter((delivery) => {
    const supplierName = delivery.supplier?.companyName || delivery.supplier?.names || ""
    const deliveryId = delivery.id || ""
    const items = delivery.requestItem?.requestItemDetails?.map(d => d.item?.name || "").join(" ") || ""

    const matchesSearch =
      supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.toLowerCase().includes(searchTerm.toLowerCase())

    const deliveryStatus = delivery.deliveryStatus?.toUpperCase() || ""
    const normalizedStatus = deliveryStatus === "SCHEDULED" || deliveryStatus === "APPROVED" ? "pending" :
                             deliveryStatus === "DELIVERED" ? "received" :
                             deliveryStatus === "PROCESSING" ? "partial" :
                             deliveryStatus === "CANCELLED" ? "rejected" : "pending"
    
    const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter

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

    try {
      setIsProcessing(true)
      await receivingService.receiveOrder(selectedDelivery.id)
      
      // Refresh the list
      const schoolId = localStorage.getItem("schoolId")
      if (schoolId) {
        const data = await receivingService.getAllReceiving(schoolId)
        setDeliveries(Array.isArray(data) ? data : [])
      }
      
      toast.success("Order received successfully")
      setReceiveDialogOpen(false)
      setSelectedDelivery(null)
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
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "received":
        return <Badge className="bg-green-600 hover:bg-green-700">Received</Badge>
      case "partial":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Partial
          </Badge>
        )
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
          <Link to="/stock-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Receiving Management</h1>
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
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Stock Keeper</p>
                    <p className="text-xs leading-none text-muted-foreground">stockkeeper@school.rw</p>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                        const normalizedStatus = deliveryStatus === "SCHEDULED" || deliveryStatus === "APPROVED" ? "pending" :
                                                 deliveryStatus === "DELIVERED" ? "received" :
                                                 deliveryStatus === "PROCESSING" ? "partial" :
                                                 deliveryStatus === "CANCELLED" ? "rejected" : "pending"
                        const canReceive = normalizedStatus === "pending"
                        
                        return (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{delivery.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{delivery.supplier?.companyName || delivery.supplier?.names || "N/A"}</TableCell>
                            <TableCell>
                              {delivery.requestItem?.requestItemDetails && delivery.requestItem.requestItemDetails.length > 0 ? (
                                delivery.requestItem.requestItemDetails.map((detail, index) => (
                                  <div key={index} className="text-sm">
                                    {detail.item?.name || "N/A"} ({detail.quantity || 0}{detail.item?.unit || "kg"})
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
                            <TableCell>{getStatusBadge(normalizedStatus)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDelivery(delivery)
                                  setReceiveDialogOpen(true)
                                }}
                                disabled={isProcessing || !canReceive}
                              >
                                {canReceive ? "Receive" : "View Details"}
                              </Button>
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

      {/* Receive Delivery Dialog */}
      {selectedDelivery && (
        <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Receive Delivery</DialogTitle>
              <DialogDescription>Verify and receive incoming delivery items</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                  <p>{selectedDelivery.orderNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p>{selectedDelivery.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Date</p>
                  <p>{selectedDelivery.expectedDate}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead className="w-[100px]">Accept</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDelivery.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item}</TableCell>
                          <TableCell>{selectedDelivery.quantities[index]}</TableCell>
                          <TableCell>
                            <Input type="text" defaultValue={selectedDelivery.quantities[index]} className="h-8 w-24" />
                          </TableCell>
                          <TableCell>
                            <Select defaultValue="good">
                              <SelectTrigger className="h-8 w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this delivery"
                  defaultValue={selectedDelivery.notes}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Reject Delivery
                </Button>
                <Button onClick={handleReceiveDelivery}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Receipt
                </Button>
              </div>
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
