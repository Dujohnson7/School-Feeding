
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Calendar, Check, Filter, LogOut, Package, Plus, Search, Settings, User, Trash2 } from "lucide-react"
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

interface Item {
  id: string
  name?: string
}

interface StockOutItem {
  id?: string
  item?: Item
  quantity?: number
  unit?: string
}

interface StockOut {
  id?: string
  created?: string
  updated?: string
  date?: string
  destination?: string
  requestedBy?: string
  status?: "PENDING" | "COMPLETED" | "CANCELLED" | "pending" | "completed" | "cancelled"
  notes?: string
  stockOutItems?: StockOutItem[]
  school?: { id?: string; name?: string }
}

const API_BASE_URL = "http://localhost:8070/api/distribute"

const distributionService = {
  getAllDistributions: async (schoolId: string) => {
    const response = await axios.get(`${API_BASE_URL}/all/${schoolId}`)
    return response.data
  },

  getDistribution: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  },

  createDistribution: async (stockOut: StockOut) => {
    const response = await axios.post(`${API_BASE_URL}/register`, stockOut)
    return response.data
  },

  updateDistribution: async (id: string, stockOut: StockOut) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, stockOut)
    return response.data
  },

  deleteDistribution: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`)
    return response.data
  },
}

export function StockDistribution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDistribution, setSelectedDistribution] = useState<StockOut | null>(null)
  const [distributions, setDistributions] = useState<StockOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false)
  const [newDistributionOpen, setNewDistributionOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Form state for new distribution
  const [newDistribution, setNewDistribution] = useState({
    date: new Date().toISOString().split('T')[0],
    destination: "",
    requestedBy: "",
    notes: "",
    items: [] as Array<{ itemId: string; quantity: number; unit: string }>
  })
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Fetch available items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true)
        const response = await axios.get("http://localhost:8070/api/item/all")
        setAvailableItems(response.data || [])
      } catch (err: any) {
        console.error("Error fetching items:", err)
        toast.error("Failed to load items")
      } finally {
        setLoadingItems(false)
      }
    }
    fetchItems()
  }, [])

  // Fetch distributions on component mount
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        setLoading(true)
        setError(null)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) {
          setError("School ID not found")
          return
        }
        const data = await distributionService.getAllDistributions(schoolId)
        setDistributions(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching distributions:", err)
        if (err.response?.status === 404) {
          setDistributions([])
          setError(null)
        } else {
          setError(err.response?.data || "Failed to fetch distributions")
          toast.error("Failed to load distributions")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDistributions()
  }, [])

  // Filter distributions based on search term and status filter
  const filteredDistributions = (Array.isArray(distributions) ? distributions : []).filter((distribution) => {
    const destination = distribution.destination || ""
    const id = distribution.id || ""
    const requestedBy = distribution.requestedBy || ""
    const items = distribution.stockOutItems?.map(si => si.item?.name || "").join(" ") || ""

    const matchesSearch =
      destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.toLowerCase().includes(searchTerm.toLowerCase())

    const status = distribution.status?.toUpperCase() || ""
    const normalizedStatus = status === "PENDING" ? "pending" : 
                            status === "COMPLETED" ? "completed" : 
                            status === "CANCELLED" ? "cancelled" : status.toLowerCase()
    
    const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDistributions.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedDistributions = filteredDistributions.slice(startIndex, startIndex + pageSize)

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

  const handleDistribute = async () => {
    if (!selectedDistribution || !selectedDistribution.id) return

    try {
      setIsProcessing(true)
      const updatedDistribution: StockOut = {
        ...selectedDistribution,
        status: "COMPLETED"
      }
      await distributionService.updateDistribution(selectedDistribution.id, updatedDistribution)
      
      // Refresh the list
      const schoolId = localStorage.getItem("schoolId")
      if (schoolId) {
        const data = await distributionService.getAllDistributions(schoolId)
        setDistributions(Array.isArray(data) ? data : [])
      }
      
      toast.success("Distribution processed successfully")
      setDistributeDialogOpen(false)
      setSelectedDistribution(null)
    } catch (err: any) {
      console.error("Error processing distribution:", err)
      toast.error(err.response?.data || "Failed to process distribution")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateDistribution = async () => {
    if (!newDistribution.destination || !newDistribution.requestedBy || newDistribution.items.length === 0) {
      toast.error("Please fill in all required fields and add at least one item")
      return
    }

    try {
      setIsProcessing(true)
      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      const stockOutPayload: StockOut = {
        date: newDistribution.date,
        destination: newDistribution.destination,
        requestedBy: newDistribution.requestedBy,
        notes: newDistribution.notes,
        status: "PENDING",
        school: { id: schoolId },
        stockOutItems: newDistribution.items.map(item => ({
          item: { id: item.itemId },
          quantity: item.quantity,
          unit: item.unit
        }))
      }

      await distributionService.createDistribution(stockOutPayload)
      
      // Refresh the list
      const data = await distributionService.getAllDistributions(schoolId)
      setDistributions(data || [])
      
      toast.success("Distribution created successfully")
      setNewDistributionOpen(false)
      setNewDistribution({
        date: new Date().toISOString().split('T')[0],
        destination: "",
        requestedBy: "",
        notes: "",
        items: []
      })
    } catch (err: any) {
      console.error("Error creating distribution:", err)
      toast.error(err.response?.data || "Failed to create distribution")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteDistribution = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this distribution?")) {
      return
    }

    try {
      setIsProcessing(true)
      await distributionService.deleteDistribution(id)
      
      // Refresh the list
      const schoolId = localStorage.getItem("schoolId")
      if (schoolId) {
        const data = await distributionService.getAllDistributions(schoolId)
        setDistributions(Array.isArray(data) ? data : [])
      }
      
      toast.success("Distribution deleted successfully")
    } catch (err: any) {
      console.error("Error deleting distribution:", err)
      toast.error(err.response?.data || "Failed to delete distribution")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddItem = () => {
    setNewDistribution({
      ...newDistribution,
      items: [...newDistribution.items, { itemId: "", quantity: 0, unit: "kg" }]
    })
  }

  const handleRemoveItem = (index: number) => {
    setNewDistribution({
      ...newDistribution,
      items: newDistribution.items.filter((_, i) => i !== index)
    })
  }

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...newDistribution.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewDistribution({ ...newDistribution, items: updatedItems })
  }

  const getStatusBadge = (status?: string) => {
    const normalizedStatus = status?.toUpperCase() || ""
    switch (normalizedStatus) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "COMPLETED":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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

  if (error && distributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading distributions</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
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
            <h1 className="text-lg font-semibold">Distribution Management</h1>
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
                  <CardTitle>Food Distribution</CardTitle>
                  <CardDescription>Manage and track food distribution to kitchens</CardDescription>
                </div>
                <Button onClick={() => setNewDistributionOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Distribution
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
                      placeholder="Search by destination, ID, or requested by..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.length > 0 ? (
                      paginatedDistributions.map((distribution) => {
                        const status = distribution.status?.toUpperCase() || ""
                        const isPending = status === "PENDING"
                        return (
                          <TableRow key={distribution.id}>
                            <TableCell className="font-medium">{distribution.id?.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(distribution.date || distribution.created)}
                              </div>
                            </TableCell>
                            <TableCell>{distribution.destination || "N/A"}</TableCell>
                            <TableCell>
                              {distribution.stockOutItems && distribution.stockOutItems.length > 0 ? (
                                distribution.stockOutItems.map((stockItem, index) => (
                                  <div key={index} className="text-sm">
                                    {stockItem.item?.name || "N/A"} ({stockItem.quantity || 0}{stockItem.unit || "kg"})
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No items</span>
                              )}
                            </TableCell>
                            <TableCell>{distribution.requestedBy || "N/A"}</TableCell>
                            <TableCell>{getStatusBadge(distribution.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDistribution(distribution)
                                    setDistributeDialogOpen(true)
                                  }}
                                  disabled={isProcessing}
                                >
                                  {isPending ? "Process" : "View Details"}
                                </Button>
                                {isPending && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => distribution.id && handleDeleteDistribution(distribution.id)}
                                    disabled={isProcessing}
                                  >
                                    Delete
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
                          {distributions.length === 0 ? "No distribution found" : "No distributions found matching your search."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredDistributions.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredDistributions.length)} of {filteredDistributions.length}
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

      {/* Process Distribution Dialog */}
      {selectedDistribution && (
        <Dialog open={distributeDialogOpen} onOpenChange={setDistributeDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Process Distribution</DialogTitle>
              <DialogDescription>Verify and process food distribution</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distribution ID</p>
                  <p className="font-medium">{selectedDistribution.id?.substring(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedDistribution.date || selectedDistribution.created)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destination</p>
                  <p>{selectedDistribution.destination || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                  <p>{selectedDistribution.requestedBy || "N/A"}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Requested Quantity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDistribution.stockOutItems && selectedDistribution.stockOutItems.length > 0 ? (
                        selectedDistribution.stockOutItems.map((stockItem, index) => (
                          <TableRow key={index}>
                            <TableCell>{stockItem.item?.name || "N/A"}</TableCell>
                            <TableCell>{stockItem.quantity || 0} {stockItem.unit || "kg"}</TableCell>
                            <TableCell>{getStatusBadge(selectedDistribution.status)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No items
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this distribution"
                  defaultValue={selectedDistribution.notes || ""}
                  readOnly
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDistributeDialogOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              {selectedDistribution.status?.toUpperCase() === "PENDING" && (
                <Button onClick={handleDistribute} disabled={isProcessing}>
                  <Check className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Process Distribution"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Distribution Dialog */}
      <Dialog open={newDistributionOpen} onOpenChange={setNewDistributionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Distribution</DialogTitle>
            <DialogDescription>Create a new food distribution record</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newDistribution.date}
                  onChange={(e) => setNewDistribution({ ...newDistribution, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Select 
                  value={newDistribution.destination}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, destination: value })}
                >
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="event">Special Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requested-by">Requested By *</Label>
              <Input 
                id="requested-by" 
                placeholder="Name of requester"
                value={newDistribution.requestedBy}
                onChange={(e) => setNewDistribution({ ...newDistribution, requestedBy: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Items *</Label>
              <div className="rounded-md border p-4">
                {loadingItems ? (
                  <p className="text-sm text-muted-foreground">Loading items...</p>
                ) : (
                  <div className="space-y-4">
                    {newDistribution.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={item.itemId}
                            onValueChange={(value) => handleUpdateItem(index, "itemId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableItems.map((availableItem) => (
                                <SelectItem key={availableItem.id} value={availableItem.id}>
                                  {availableItem.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input 
                          type="number"
                          placeholder="Quantity" 
                          className="w-24"
                          value={item.quantity || ""}
                          onChange={(e) => handleUpdateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                        <div className="w-24">
                          <Select
                            value={item.unit}
                            onValueChange={(value) => handleUpdateItem(index, "unit", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="pcs">pcs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleAddItem}
                      type="button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any notes about this distribution"
                value={newDistribution.notes}
                onChange={(e) => setNewDistribution({ ...newDistribution, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewDistributionOpen(false)
                setNewDistribution({
                  date: new Date().toISOString().split('T')[0],
                  destination: "",
                  requestedBy: "",
                  notes: "",
                  items: []
                })
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDistribution}
              disabled={isProcessing || newDistribution.items.length === 0}
            >
              {isProcessing ? "Creating..." : "Create Distribution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
