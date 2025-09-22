
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Calendar,
  Check,
  Filter,
  Home,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Truck,
  TrendingUp,
  User,
  X,
} from "lucide-react"

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

export function StockReceiving() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [newDeliveryOpen, setNewDeliveryOpen] = useState(false)

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
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">Stock Management</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/stock-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/stock-inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              to="/stock-receiving"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Receiving
            </Link>
            <Link
              to="/stock-distribution"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              Distribution
            </Link>
            <Link
              to="/stock-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/stock-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
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
        <main className="flex-1 overflow-auto p-4 md:p-6">
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
                      filteredDeliveries.map((delivery) => (
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
                    <Select className="flex-1">
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
                    <Input placeholder="Quantity" className="w-24" />
                    <Select className="w-24">
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="pcs">pcs</SelectItem>
                      </SelectContent>
                    </Select>
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
