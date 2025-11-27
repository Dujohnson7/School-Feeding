
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowUpDown, Bell, Download, Filter, Package, Plus, Search, Settings, User, LogOut } from "lucide-react"
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Stock {
  id?: string
  created?: string
  updated?: string
  quantity?: number
  batchNumber?: string
  receivedDate?: string
  expiryDate?: string
  location?: string
  item?: {
    id?: string
    name?: string
    category?: string
    unit?: string
  }
  school?: {
    id?: string
    name?: string
  }
}

const API_BASE_URL = "http://localhost:8070/api/inventory"

const inventoryService = {
  getAllInventory: async (schoolId: string) => {
    const response = await axios.get(`${API_BASE_URL}/all/${schoolId}`)
    return response.data
  },
}

export function StockInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<Stock | null>(null)
  const [inventoryItems, setInventoryItems] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Fetch inventory on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        setError(null)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) {
          setError("School ID not found")
          return
        }
        const data = await inventoryService.getAllInventory(schoolId)
        setInventoryItems(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching inventory:", err)
        if (err.response?.status === 404) {
          setInventoryItems([])
          setError(null)
        } else {
          setError(err.response?.data || "Failed to fetch inventory")
          toast.error("Failed to load inventory")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  // Helper function to determine status based on quantity and expiry date
  const getItemStatus = (item: Stock): "normal" | "low" | "critical" | "expired" => {
    if (!item.quantity) return "critical"
    
    const quantity = item.quantity
    const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null
    const today = new Date()
    
    if (expiryDate && expiryDate < today) return "expired"
    if (quantity < 50) return "critical"
    if (quantity < 100) return "low"
    return "normal"
  }

  // Filter inventory items based on search term and filters
  const filteredItems = (Array.isArray(inventoryItems) ? inventoryItems : []).filter((item) => {
    const itemName = item.item?.name || ""
    const itemId = item.id || ""
    const batchNumber = item.batchNumber || ""
    const category = item.item?.category || ""

    const matchesSearch =
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || category === categoryFilter
    const itemStatus = getItemStatus(item)
    const matchesStatus = statusFilter === "all" || itemStatus === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, categoryFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize)

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

  const handleAdjustStock = () => {
    // In a real app, this would update the inventory item quantity
    console.log(`Adjusting stock for ${selectedItem?.item?.name}`)
    setAdjustDialogOpen(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && inventoryItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading inventory</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
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
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
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
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage and track your food inventory</CardDescription>
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
                      paginatedItems.map((item) => {
                        const itemStatus = getItemStatus(item)
                        const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null
                        const isExpiringSoon = expiryDate && expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id?.substring(0, 8)}...</TableCell>
                            <TableCell>{item.item?.name || "N/A"}</TableCell>
                            <TableCell className="capitalize">{item.item?.category || "N/A"}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity || 0} {item.item?.unit || "kg"}
                            </TableCell>
                            <TableCell>{item.batchNumber || "N/A"}</TableCell>
                            <TableCell>
                              {formatDate(item.receivedDate)}
                            </TableCell>
                            <TableCell>
                              {formatDate(item.expiryDate)}
                              {isExpiringSoon && (
                                <AlertTriangle className="ml-2 inline h-4 w-4 text-amber-500" />
                              )}
                            </TableCell>
                            <TableCell>{item.location || "N/A"}</TableCell>
                            <TableCell>{getStatusBadge(itemStatus)}</TableCell>
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
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          {inventoryItems.length === 0 ? "No inventory found" : "No inventory items found matching your search."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredItems.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredItems.length)} of {filteredItems.length}
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
