
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Edit, Package, Plus, Search, Trash2 } from "lucide-react"

import { stockService } from "./service/stockService"
import { schoolService } from "../school/service/schoolService"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  stockOutItemDetails?: StockOutItem[]
  school?: { id?: string; name?: string }
  mealType?: string
  studentServed?: number
}

interface InventoryItem {
  id?: string
  quantity?: number
  item?: {
    id?: string
    name?: string
  }
}



export function StockDistribution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistribution, setSelectedDistribution] = useState<StockOut | null>(null)
  const [distributions, setDistributions] = useState<StockOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false)
  const [newDistributionOpen, setNewDistributionOpen] = useState(false)
  const [editDistributionOpen, setEditDistributionOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Form state for new/edit distribution
  const [newDistribution, setNewDistribution] = useState({
    date: new Date().toISOString().split('T')[0],
    schoolId: "",
    mealType: "LAUNCH",
    studentServed: 0,
    items: [] as Array<{ itemId: string; quantity: number }>
  })
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [schoolName, setSchoolName] = useState<string>("")
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingInventory, setLoadingInventory] = useState(true)

  // Fetch available items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true)
        const data = await stockService.getAllItems()
        setAvailableItems(data || [])
      } catch (err: any) {
        console.error("Error fetching items:", err)
        toast.error("Failed to load items")
      } finally {
        setLoadingItems(false)
      }
    }
    fetchItems()
  }, [])

  // Fetch inventory items (only items in stock)
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoadingInventory(true)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) return

        console.log("Fetching inventory for schoolId:", schoolId)
        const data = await stockService.getAllInventory(schoolId)
        const inventory = Array.isArray(data) ? data : []
        // Filter only items with quantity > 0
        const inStockItems = inventory.filter((item: InventoryItem) => (item.quantity || 0) > 0)
        setInventoryItems(inStockItems)
      } catch (err: any) {
        console.error("Error fetching inventory:", err)
        if (err.response?.status === 403) {
          console.error("403 Forbidden: Check if the user has permission to view inventory for schoolId:", localStorage.getItem("schoolId"))
        }
        toast.error("Failed to load inventory")
      } finally {
        setLoadingInventory(false)
      }
    }
    fetchInventory()
  }, [])

  // Get school name from localStorage or distributions
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const schoolId = localStorage.getItem("schoolId")

    if (user?.school) {
      // School can be an object with name property or just a string
      if (typeof user.school === 'object' && user.school?.name) {
        setSchoolName(user.school.name)
      } else if (typeof user.school === 'string') {
        setSchoolName(user.school)
      }
    }

    // Set schoolId from localStorage for new distributions
    if (schoolId && !newDistribution.schoolId) {
      setNewDistribution(prev => ({ ...prev, schoolId }))
    }
  }, [])

  // Fetch school stats for total students
  useEffect(() => {
    const fetchSchoolStats = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) return

        const stats = await schoolService.getTotalStudent(schoolId)
        if (typeof stats === 'number') {
          setNewDistribution(prev => ({
            ...prev,
            studentServed: stats
          }))
        }
      } catch (err) {
        console.error("Error fetching school stats:", err)
      }
    }
    fetchSchoolStats()
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
        console.log("Fetching distributions for schoolId:", schoolId)
        const data = await stockService.getAllDistributions(schoolId)
        setDistributions(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching distributions:", err)
        if (err.response?.status === 403) {
          console.error("403 Forbidden: Check if the user has permission to view distributions for schoolId:", localStorage.getItem("schoolId"))
        }
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

  // Helper function to get item name from ID
  const getItemName = (itemId?: string) => {
    if (!itemId) return "N/A"
    const item = availableItems.find(i => i.id === itemId)
    return item?.name || itemId.substring(0, 8) + "..."
  }

  // Filter distributions based on search term
  const filteredDistributions = (Array.isArray(distributions) ? distributions : []).filter((distribution) => {
    const id = distribution.id || ""
    const items = distribution.stockOutItemDetails?.map(si => {
      const itemId = si.item?.id || ""
      return getItemName(itemId)
    }).join(" ") || ""

    const matchesSearch =
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

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

  const handleEditDistribution = (distribution: StockOut) => {
    setSelectedDistribution(distribution)
    const distSchoolName = distribution.school?.name || ""
    if (distSchoolName) {
      setSchoolName(distSchoolName)
    }
    setNewDistribution({
      date: distribution.date || distribution.created?.split('T')[0] || new Date().toISOString().split('T')[0],
      schoolId: distribution.school?.id || localStorage.getItem("schoolId") || "",
      mealType: distribution.mealType || "LAUNCH",
      studentServed: distribution.studentServed || 0,
      items: (distribution.stockOutItemDetails || []).map(item => ({
        itemId: item.item?.id || "",
        quantity: item.quantity || 0
      }))
    })
    setEditDistributionOpen(true)
  }

  const handleUpdateDistribution = async () => {
    if (!selectedDistribution || !selectedDistribution.id) return
    if (newDistribution.items.length === 0) {
      toast.error("Please add at least one item")
      return
    }
    const schoolId = newDistribution.schoolId || localStorage.getItem("schoolId")
    if (!schoolId) {
      toast.error("School ID not found")
      return
    }

    try {
      setIsProcessing(true)
      const stockOutPayload: any = {
        school: { id: schoolId },
        mealType: newDistribution.mealType,
        studentServed: newDistribution.studentServed,
        stockOutItemDetails: newDistribution.items.map(item => ({
          item: { id: item.itemId },
          quantity: item.quantity
        }))
      }

      await stockService.updateDistribution(selectedDistribution.id, stockOutPayload)

      // Refresh the list
      const refreshSchoolId = localStorage.getItem("schoolId")
      if (refreshSchoolId) {
        const data = await stockService.getAllDistributions(refreshSchoolId)
        setDistributions(Array.isArray(data) ? data : [])
      }

      toast.success("Distribution updated successfully")
      setEditDistributionOpen(false)
      setSelectedDistribution(null)
      setNewDistribution({
        date: new Date().toISOString().split('T')[0],
        schoolId: localStorage.getItem("schoolId") || "",
        mealType: "LAUNCH",
        studentServed: 0,
        items: []
      })
    } catch (err: any) {
      console.error("Error updating distribution:", err)
      toast.error(err.response?.data || "Failed to update distribution")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateDistribution = async () => {
    if (newDistribution.items.length === 0) {
      toast.error("Please add at least one item")
      return
    }
    const schoolId = newDistribution.schoolId || localStorage.getItem("schoolId")
    if (!schoolId) {
      toast.error("School ID not found")
      return
    }

    try {
      setIsProcessing(true)
      const stockOutPayload: any = {
        school: { id: schoolId },
        mealType: newDistribution.mealType,
        studentServed: newDistribution.studentServed,
        stockOutItemDetails: newDistribution.items.map(item => ({
          item: { id: item.itemId },
          quantity: item.quantity
        }))
      }

      await stockService.createDistribution(stockOutPayload)

      // Refresh the list
      const refreshSchoolId = localStorage.getItem("schoolId")
      if (refreshSchoolId) {
        const data = await stockService.getAllDistributions(refreshSchoolId)
        setDistributions(data || [])
      }

      toast.success("Distribution created successfully")
      setNewDistributionOpen(false)
      setNewDistribution({
        date: new Date().toISOString().split('T')[0],
        schoolId: localStorage.getItem("schoolId") || "",
        mealType: "LAUNCH",
        studentServed: 0,
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
      await stockService.deleteDistribution(id)

      // Refresh the list
      const schoolId = localStorage.getItem("schoolId")
      if (schoolId) {
        const data = await stockService.getAllDistributions(schoolId)
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
      items: [...newDistribution.items, { itemId: "", quantity: 0 }]
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

    // Validate: prevent selecting the same item twice
    if (field === "itemId" && value) {
      const duplicateIndex = updatedItems.findIndex((item, i) => i !== index && item.itemId === value)
      if (duplicateIndex !== -1) {
        toast.error("This item is already selected. Please choose a different item.")
        return
      }
    }

    setNewDistribution({ ...newDistribution, items: updatedItems })
  }

  // Get available items from inventory (only items in stock)
  const getAvailableItemsForSelection = () => {
    // Get item IDs that are already selected
    const selectedItemIds = new Set(newDistribution.items.map(item => item.itemId).filter(Boolean))

    // Filter inventory items that are in stock and not already selected
    return inventoryItems
      .filter(invItem => {
        const itemId = invItem.item?.id
        return itemId && (invItem.quantity || 0) > 0 && !selectedItemIds.has(itemId)
      })
      .map(invItem => {
        const itemId = invItem.item?.id || ""
        const item = availableItems.find(i => i.id === itemId)
        return {
          id: itemId,
          name: item?.name || invItem.item?.name || itemId.substring(0, 8) + "...",
          quantity: invItem.quantity || 0
        }
      })
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
          <HeaderActions role="stock" />
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
                <div className="flex gap-2">

                  <Button onClick={() => setNewDistributionOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Distribution
                  </Button>
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
                      placeholder="Search by ID or items..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.length > 0 ? (
                      paginatedDistributions.map((distribution) => {
                        return (
                          <TableRow key={distribution.id}>
                            <TableCell className="font-medium">{distribution.id?.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(distribution.created)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {distribution.stockOutItemDetails && distribution.stockOutItemDetails.length > 0 ? (
                                distribution.stockOutItemDetails.map((stockItem, index) => (
                                  <div key={index} className="text-sm">
                                    {getItemName(stockItem.item?.id)} ({stockItem.quantity || 0})
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No items</span>
                              )}
                            </TableCell>
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
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditDistribution(distribution)}
                                  disabled={isProcessing}
                                >
                                  <Edit className="mr-2 h-4 w-4" />

                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => distribution.id && handleDeleteDistribution(distribution.id)}
                                  disabled={isProcessing}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />

                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
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
                  <p>{formatDate(selectedDistribution.created)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Meal Type</p>
                  <Badge variant="outline">{selectedDistribution.mealType || "LAUNCH"}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students Served</p>
                  <p>{selectedDistribution.studentServed || 0}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDistribution.stockOutItemDetails && selectedDistribution.stockOutItemDetails.length > 0 ? (
                        selectedDistribution.stockOutItemDetails.map((stockItem, index) => (
                          <TableRow key={index}>
                            <TableCell>{getItemName(stockItem.item?.id)}</TableCell>
                            <TableCell>{stockItem.quantity || 0}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            No items
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDistributeDialogOpen(false)} disabled={isProcessing}>
                Close
              </Button>
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
                <Label htmlFor="mealType">Meal Type *</Label>
                <Select
                  value={newDistribution.mealType}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, mealType: value })}
                >
                  <SelectTrigger id="mealType">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                    <SelectItem value="LAUNCH">Lunch</SelectItem>
                    <SelectItem value="DINNER">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentServed">Students Served *</Label>
                <Input
                  id="studentServed"
                  type="number"
                  value={newDistribution.studentServed}
                  onChange={(e) => setNewDistribution({ ...newDistribution, studentServed: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <div className="px-3 py-2 border rounded-md bg-muted/50">
                  <p className="text-sm font-medium">{schoolName || "Loading..."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Items * (Only items in stock are available)</Label>
              <div className="rounded-md border p-4">
                {loadingItems || loadingInventory ? (
                  <p className="text-sm text-muted-foreground">Loading items...</p>
                ) : (
                  <div className="space-y-4">
                    {newDistribution.items.map((item, index) => {
                      const availableItemsForSelection = getAvailableItemsForSelection()
                      // Include currently selected item in the list
                      const currentItem = availableItems.find(i => i.id === item.itemId)
                      const allAvailableItems = currentItem && item.itemId
                        ? [{ id: item.itemId, name: currentItem.name || "", quantity: 0 }, ...availableItemsForSelection]
                        : availableItemsForSelection

                      return (
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
                                {allAvailableItems.length === 0 ? (
                                  <SelectItem value="" disabled>No items in stock</SelectItem>
                                ) : (
                                  allAvailableItems.map((availableItem) => (
                                    <SelectItem key={availableItem.id} value={availableItem.id}>
                                      {availableItem.name} {availableItem.quantity > 0 && `(Stock: ${availableItem.quantity})`}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            type="number"
                            placeholder="Quantity"
                            className="w-32"
                            value={item.quantity || ""}
                            onChange={(e) => handleUpdateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleAddItem}
                      type="button"
                      disabled={getAvailableItemsForSelection().length === 0 && newDistribution.items.length > 0}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewDistributionOpen(false)
                setNewDistribution({
                  date: new Date().toISOString().split('T')[0],
                  schoolId: localStorage.getItem("schoolId") || "",
                  mealType: "LAUNCH",
                  studentServed: 0,
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

      {/* Edit Distribution Dialog */}
      <Dialog open={editDistributionOpen} onOpenChange={setEditDistributionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Distribution</DialogTitle>
            <DialogDescription>Update distribution details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={newDistribution.date}
                  onChange={(e) => setNewDistribution({ ...newDistribution, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mealType">Meal Type *</Label>
                <Select
                  value={newDistribution.mealType}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, mealType: value })}
                >
                  <SelectTrigger id="edit-mealType">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                    <SelectItem value="LUNCH">Lunch</SelectItem>
                    <SelectItem value="SNACK">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-studentServed">Students Served *</Label>
                <Input
                  id="edit-studentServed"
                  type="number"
                  value={newDistribution.studentServed}
                  onChange={(e) => setNewDistribution({ ...newDistribution, studentServed: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school">School Name</Label>
                <div className="px-3 py-2 border rounded-md bg-muted/50">
                  <p className="text-sm font-medium">{schoolName || "Loading..."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Items * (Only items in stock are available)</Label>
              <div className="rounded-md border p-4">
                {loadingItems || loadingInventory ? (
                  <p className="text-sm text-muted-foreground">Loading items...</p>
                ) : (
                  <div className="space-y-4">
                    {newDistribution.items.map((item, index) => {
                      const availableItemsForSelection = getAvailableItemsForSelection()
                      // Include currently selected item in the list
                      const currentItem = availableItems.find(i => i.id === item.itemId)
                      const allAvailableItems = currentItem && item.itemId
                        ? [{ id: item.itemId, name: currentItem.name || "", quantity: 0 }, ...availableItemsForSelection]
                        : availableItemsForSelection

                      return (
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
                                {allAvailableItems.length === 0 ? (
                                  <SelectItem value="" disabled>No items in stock</SelectItem>
                                ) : (
                                  allAvailableItems.map((availableItem) => (
                                    <SelectItem key={availableItem.id} value={availableItem.id}>
                                      {availableItem.name} {availableItem.quantity > 0 && `(Stock: ${availableItem.quantity})`}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            type="number"
                            placeholder="Quantity"
                            className="w-32"
                            value={item.quantity || ""}
                            onChange={(e) => handleUpdateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleAddItem}
                      type="button"
                      disabled={getAvailableItemsForSelection().length === 0 && newDistribution.items.length > 0}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDistributionOpen(false)
                setSelectedDistribution(null)
                setNewDistribution({
                  date: new Date().toISOString().split('T')[0],
                  schoolId: localStorage.getItem("schoolId") || "",
                  mealType: "LAUNCH",
                  studentServed: 0,
                  items: []
                })
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDistribution}
              disabled={isProcessing || newDistribution.items.length === 0}
            >
              {isProcessing ? "Updating..." : "Update Distribution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
