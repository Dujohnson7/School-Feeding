
import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowUpDown, Bell, Download, Filter, Package, Plus, Search, Settings, User, LogOut } from "lucide-react"

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

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  batchNumber: string
  receivedDate: string
  expiryDate: string
  location: string
  status: "normal" | "low" | "critical" | "expired"
}

export function StockInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)

  // Sample data
  const inventoryItems: InventoryItem[] = [
    {
      id: "INV-001",
      name: "Rice",
      category: "grains",
      quantity: 1200,
      unit: "kg",
      batchNumber: "R2025-042",
      receivedDate: "Apr 7, 2025",
      expiryDate: "Oct 7, 2025",
      location: "Warehouse A, Shelf 1",
      status: "normal",
    },
    {
      id: "INV-002",
      name: "Beans",
      category: "legumes",
      quantity: 850,
      unit: "kg",
      batchNumber: "B2025-038",
      receivedDate: "Apr 5, 2025",
      expiryDate: "Oct 5, 2025",
      location: "Warehouse A, Shelf 2",
      status: "normal",
    },
    {
      id: "INV-003",
      name: "Maize",
      category: "grains",
      quantity: 950,
      unit: "kg",
      batchNumber: "M2025-040",
      receivedDate: "Apr 6, 2025",
      expiryDate: "Oct 6, 2025",
      location: "Warehouse A, Shelf 3",
      status: "normal",
    },
    {
      id: "INV-004",
      name: "Vegetables",
      category: "produce",
      quantity: 120,
      unit: "kg",
      batchNumber: "V2025-038",
      receivedDate: "Apr 15, 2025",
      expiryDate: "Apr 27, 2025",
      location: "Cold Storage, Section B",
      status: "low",
    },
    {
      id: "INV-005",
      name: "Oil",
      category: "condiments",
      quantity: 80,
      unit: "L",
      batchNumber: "O2025-035",
      receivedDate: "Apr 3, 2025",
      expiryDate: "May 13, 2025",
      location: "Warehouse B, Shelf 1",
      status: "low",
    },
    {
      id: "INV-006",
      name: "Salt",
      category: "condiments",
      quantity: 30,
      unit: "kg",
      batchNumber: "S2025-032",
      receivedDate: "Apr 1, 2025",
      expiryDate: "Apr 1, 2026",
      location: "Warehouse B, Shelf 2",
      status: "critical",
    },
    {
      id: "INV-007",
      name: "Milk",
      category: "dairy",
      quantity: 50,
      unit: "L",
      batchNumber: "M2025-042",
      receivedDate: "Apr 15, 2025",
      expiryDate: "Apr 20, 2025",
      location: "Cold Storage, Section A",
      status: "critical",
    },
  ]

  // Filter inventory items based on search term and filters
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAdjustStock = () => {
    // In a real app, this would update the inventory item quantity
    console.log(`Adjusting stock for ${selectedItem?.name}`)
    setAdjustDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-600 hover:bg-green-700">Normal</Badge>
      case "low":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Low
          </Badge>
        )
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleExport = (format: string) => {
    // In a real app, this would generate and download a report
    console.log(`Exporting inventory in ${format} format`)
    alert(`Inventory would be exported as ${format.toUpperCase()} in a real application`)
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/stock-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Inventory Management</h1>
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
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage and track your food inventory</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                      placeholder="Search by name, ID, or batch number..."
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
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="legumes">Legumes</SelectItem>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="condiments">Condiments</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Batch #</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="capitalize">{item.category}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell>{item.batchNumber}</TableCell>
                          <TableCell>
                            {item.expiryDate}
                            {new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                              <AlertTriangle className="ml-2 inline h-4 w-4 text-amber-500" />
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setAdjustDialogOpen(true)
                              }}
                            >
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No inventory items found.
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

      {/* Adjust Stock Dialog */}
      {selectedItem && (
        <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adjust Inventory</DialogTitle>
              <DialogDescription>Update the quantity of this inventory item</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Item</p>
                  <p className="font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Quantity</p>
                  <p>
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Batch Number</p>
                  <p>{selectedItem.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{selectedItem.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-quantity">New Quantity</Label>
                <Input id="new-quantity" type="number" defaultValue={selectedItem.quantity} min={0} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Adjustment</Label>
                <Select defaultValue="count">
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">Inventory Count</SelectItem>
                    <SelectItem value="damage">Damaged Goods</SelectItem>
                    <SelectItem value="expired">Expired Items</SelectItem>
                    <SelectItem value="correction">Data Correction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdjustStock}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
