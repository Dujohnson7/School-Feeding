
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Check, Filter, Package, Plus, Search, X } from "lucide-react"

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

interface DeliveryItem {
  id: string
  orderNumber: string
  supplier: string
  items: string[]
  quantities: string[]
  expectedDate: string
  status: "pending" | "received" | "partial" | "rejected"
  notes: string
}

export function StockReceivingTemp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [newDeliveryOpen, setNewDeliveryOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Sample data
  const deliveries: DeliveryItem[] = [
    {
      id: "DEL-2025-042",
      orderNumber: "ORD-2025-042",
      supplier: "Kigali Foods Ltd",
      items: ["Rice", "Beans"],
      quantities: ["200kg", "100kg"],
      expectedDate: "Apr 16, 2025",
      status: "pending",
      notes: "Delivery scheduled for morning arrival",
    },
    {
      id: "DEL-2025-041",
      orderNumber: "ORD-2025-041",
      supplier: "Fresh Farms Rwanda",
      items: ["Vegetables", "Fruits"],
      quantities: ["80kg", "50kg"],
      expectedDate: "Apr 17, 2025",
      status: "pending",
      notes: "Perishable items, prepare cold storage",
    },
    {
      id: "DEL-2025-040",
      orderNumber: "ORD-2025-040",
      supplier: "Rwanda Harvest Co.",
      items: ["Maize", "Potatoes"],
      quantities: ["150kg", "100kg"],
      expectedDate: "Apr 15, 2025",
      status: "received",
      notes: "All items received in good condition",
    },
    {
      id: "DEL-2025-039",
      orderNumber: "ORD-2025-039",
      supplier: "Nyabihu Dairy Products",
      items: ["Milk"],
      quantities: ["100L"],
      expectedDate: "Apr 15, 2025",
      status: "partial",
      notes: "Only 50L received due to supply shortage",
    },
    {
      id: "DEL-2025-038",
      orderNumber: "ORD-2025-038",
      supplier: "Eastern Grains Suppliers",
      items: ["Rice", "Beans", "Oil"],
      quantities: ["100kg", "50kg", "20L"],
      expectedDate: "Apr 14, 2025",
      status: "rejected",
      notes: "Items rejected due to quality issues",
    },
  ]

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter

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

  const handleReceiveDelivery = () => {
    // In a real app, this would update the delivery status and add items to inventory
    console.log(`Receiving delivery ${selectedDelivery?.id}`)
    setReceiveDialogOpen(false)
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
                <Button onClick={() => setNewDeliveryOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Delivery
                </Button>
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
                      paginatedDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.id}</TableCell>
                          <TableCell>{delivery.orderNumber}</TableCell>
                          <TableCell>{delivery.supplier}</TableCell>
                          <TableCell>
                            {delivery.items.map((item, index) => (
                              <div key={index}>
                                {item} ({delivery.quantities[index]})
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {delivery.expectedDate}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDelivery(delivery)
                                setReceiveDialogOpen(true)
                              }}
                              disabled={delivery.status === "received" || delivery.status === "rejected"}
                            >
                              {delivery.status === "pending" ? "Receive" : "View Details"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No deliveries found.
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
