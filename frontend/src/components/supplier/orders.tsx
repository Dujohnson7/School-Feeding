
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, FileText, LogOut, Package, QrCode, Search, Settings, Truck, User } from "lucide-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Order {
  id: string
  school: string
  items: string[]
  quantities: string[]
  orderDate: string
  deliveryDate: string
  status: "pending" | "processing" | "dispatched" | "delivered" | "cancelled"
  district: string
  contact: string
}

export function SupplierOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [qrScanOpen, setQrScanOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  // Sample data
  const orders: Order[] = [
    {
      id: "ORD-2025-042",
      school: "Kigali Primary School",
      items: ["Rice", "Beans"],
      quantities: ["200kg", "100kg"],
      orderDate: "Apr 7, 2025",
      deliveryDate: "Apr 10, 2025",
      status: "processing",
      district: "Kigali",
      contact: "+250 78 123 4567",
    },
    {
      id: "ORD-2025-041",
      school: "Nyamirambo Secondary School",
      items: ["Maize", "Vegetables"],
      quantities: ["150kg", "50kg"],
      orderDate: "Apr 6, 2025",
      deliveryDate: "Apr 9, 2025",
      status: "dispatched",
      district: "Kigali",
      contact: "+250 72 987 6543",
    },
    {
      id: "ORD-2025-040",
      school: "Remera High School",
      items: ["Rice", "Oil"],
      quantities: ["100kg", "20L"],
      orderDate: "Apr 5, 2025",
      deliveryDate: "Apr 8, 2025",
      status: "pending",
      district: "Kigali",
      contact: "+250 73 456 7890",
    },
    {
      id: "ORD-2025-039",
      school: "Gasabo Elementary",
      items: ["Beans", "Vegetables"],
      quantities: ["80kg", "40kg"],
      orderDate: "Apr 4, 2025",
      deliveryDate: "Apr 7, 2025",
      status: "delivered",
      district: "Kigali",
      contact: "+250 78 567 8901",
    },
    {
      id: "ORD-2025-038",
      school: "Kicukiro Academy",
      items: ["Rice", "Fruits"],
      quantities: ["120kg", "60kg"],
      orderDate: "Apr 3, 2025",
      deliveryDate: "Apr 6, 2025",
      status: "delivered",
      district: "Kigali",
      contact: "+250 72 345 6789",
    },
    {
      id: "ORD-2025-037",
      school: "Nyarugenge School",
      items: ["Maize", "Beans", "Oil"],
      quantities: ["100kg", "50kg", "10L"],
      orderDate: "Apr 2, 2025",
      deliveryDate: "Apr 5, 2025",
      status: "cancelled",
      district: "Kigali",
      contact: "+250 73 789 0123",
    },
  ]

  // Filter orders based on search term, status filter, and active tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const isActive =
      activeTab === "active"
        ? ["pending", "processing", "dispatched"].includes(order.status)
        : ["delivered", "cancelled"].includes(order.status)

    return matchesSearch && matchesStatus && isActive
  })

  const handleUpdateStatus = (order: Order, newStatus: Order["status"]) => {
    // In a real app, you would update the order status in your backend
    console.log(`Updating order ${order.id} status to ${newStatus}`)
    setDetailsOpen(false)
  }

  const handleScanQR = (order: Order) => {
    setSelectedOrder(order)
    setQrScanOpen(true)
  }

  const simulateQRScan = () => {
    // In a real app, this would use the device camera to scan a QR code
    setTimeout(() => {
      alert(`Delivery for order ${selectedOrder?.id} verified successfully!`)
      setQrScanOpen(false)
      // In a real app, you would update the order status to "delivered" here
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Processing
          </Badge>
        )
      case "dispatched":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Dispatched</Badge>
      case "delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "cancelled":
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
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/supplier-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Order Management</h1>
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
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Supplier</p>
                    <p className="text-xs leading-none text-muted-foreground">supplier@kigalifoods.rw</p>
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
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.school}</TableCell>
                          <TableCell>{order.items.join(", ")}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>{order.deliveryDate}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                              {order.status === "dispatched" && (
                                <Button size="sm" onClick={() => handleScanQR(order)}>
                                  <QrCode className="mr-2 h-4 w-4" />
                                  Verify Delivery
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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

              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
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
                  Deliver to the school kitchen entrance. Contact the school administrator upon arrival.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              {selectedOrder.status === "pending" && (
                <>
                  <Button variant="outline" onClick={() => handleUpdateStatus(selectedOrder, "cancelled")}>
                    Cancel Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus(selectedOrder, "processing")}>Start Processing</Button>
                </>
              )}

              {selectedOrder.status === "processing" && (
                <Button onClick={() => handleUpdateStatus(selectedOrder, "dispatched")} className="w-full">
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Dispatched
                </Button>
              )}

              {selectedOrder.status === "dispatched" && (
                <Button onClick={() => handleScanQR(selectedOrder)} className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Verify Delivery
                </Button>
              )}

              {(selectedOrder.status === "delivered" || selectedOrder.status === "cancelled") && (
                <Button onClick={() => setDetailsOpen(false)} className="w-full">
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Scan Dialog */}
      {selectedOrder && (
        <Dialog open={qrScanOpen} onOpenChange={setQrScanOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>Scan the QR code at the delivery location to verify delivery</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 h-48 w-48 rounded-lg bg-muted flex items-center justify-center">
                <QrCode className="h-24 w-24 text-muted-foreground" />
              </div>
              <p className="text-center text-sm text-muted-foreground">Position the QR code within the frame to scan</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setQrScanOpen(false)}>
                Cancel
              </Button>
              <Button onClick={simulateQRScan}>Simulate Scan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
