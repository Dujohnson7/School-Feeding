import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { governmentService } from "./service/governmentService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"

interface Item {
  id: string
  name: string
  perStudent: number
  description: string
  active: boolean
  foodCategory?: string
  price?: number
  unit?: string
  created?: string
  updated?: string
}



export function GovItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [foodCategories, setFoodCategories] = useState<string[]>([])
  const [foodUnits, setFoodUnits] = useState<string[]>([])

  const [newItem, setNewItem] = useState<{
    name: string
    perStudent: string
    description: string
    foodCategory: string
    price: string
    unit: string
  }>({
    name: "",
    perStudent: "",
    description: "",
    foodCategory: "",
    price: "",
    unit: "",
  })

  useEffect(() => {
    fetchItems()
    fetchFoodCategories()
    fetchFoodUnits()
  }, [])

  const fetchFoodCategories = async () => {
    try {
      const data = await governmentService.getFoodCategories()
      setFoodCategories(data || [])
    } catch (err: any) {
      console.error("Error fetching food categories:", err)
    }
  }

  const fetchFoodUnits = async () => {
    try {
      const data = await governmentService.getFoodUnits()
      setFoodUnits(data || [])
    } catch (err: any) {
      console.error("Error fetching food units:", err)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await governmentService.getAllItems()
      setItems(data || [])
    } catch (err: any) {
      console.error("Error fetching items:", err)
      toast.error("Failed to load items")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.perStudent || !newItem.description) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const itemPayload: any = {
        name: newItem.name,
        perStudent: Number(newItem.perStudent),
        description: newItem.description,
      }

      if (newItem.foodCategory) {
        itemPayload.foodCategory = newItem.foodCategory
      }
      if (newItem.price) {
        itemPayload.price = Number(newItem.price)
      }
      if (newItem.unit) {
        itemPayload.unit = newItem.unit
      }

      await governmentService.registerItem(itemPayload)
      toast.success("Item added successfully")
      setIsAddDialogOpen(false)
      setNewItem({
        name: "",
        perStudent: "",
        description: "",
        foodCategory: "",
        price: "",
        unit: "",
      })
      fetchItems()
    } catch (err: any) {
      console.error("Error adding item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to add item"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to add item")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditItem = (item: Item) => {
    setSelectedItem(item)
    setNewItem({
      name: item.name,
      perStudent: String(item.perStudent),
      description: item.description,
      foodCategory: item.foodCategory || "",
      price: item.price ? String(item.price) : "",
      unit: item.unit || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateItem = async () => {
    if (!selectedItem || !newItem.name || !newItem.perStudent || !newItem.description) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const itemPayload: any = {
        name: newItem.name,
        perStudent: Number(newItem.perStudent),
        description: newItem.description,
      }

      if (newItem.foodCategory) {
        itemPayload.foodCategory = newItem.foodCategory
      }
      if (newItem.price) {
        itemPayload.price = Number(newItem.price)
      }
      if (newItem.unit) {
        itemPayload.unit = newItem.unit
      }

      await governmentService.updateItem(selectedItem.id, itemPayload)
      toast.success("Item updated successfully")
      setIsEditDialogOpen(false)
      setSelectedItem(null)
      setNewItem({
        name: "",
        perStudent: "",
        description: "",
        foodCategory: "",
        price: "",
        unit: "",
      })
      fetchItems()
    } catch (err: any) {
      console.error("Error updating item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to update item"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to update item")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return
    }

    try {
      setIsProcessing(true)
      await governmentService.deleteItem(itemId)
      toast.success("Item deleted successfully")
      fetchItems()
    } catch (err: any) {
      console.error("Error deleting item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to delete item"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to delete item")
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.foodCategory && item.foodCategory.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategoryFilter === "all" || item.foodCategory === selectedCategoryFilter

    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategoryFilter])

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

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-1 flex-col">
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Item Management</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  Manage all food items in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCategoryFilter}
                      onValueChange={(value) => {
                        setSelectedCategoryFilter(value)
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {foodCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={isAddDialogOpen}
                      onOpenChange={(open) => {
                        setIsAddDialogOpen(open)
                        if (!open) {
                          setNewItem({
                            name: "",
                            perStudent: "",
                            description: "",
                            foodCategory: "",
                            price: "",
                            unit: "",
                          })
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add New Item</DialogTitle>
                          <DialogDescription>
                            Register a new food item in the system.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name *
                            </Label>
                            <Input
                              id="name"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              className="col-span-3"
                              placeholder="Item name (e.g., Rice, Maize)"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="perStudent" className="text-right">
                              Per Student *
                            </Label>
                            <Input
                              id="perStudent"
                              type="number"
                              step="0.01"
                              value={newItem.perStudent}
                              onChange={(e) => setNewItem({ ...newItem, perStudent: e.target.value })}
                              className="col-span-3"
                              placeholder="0.1"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description *
                            </Label>
                            <Textarea
                              id="description"
                              value={newItem.description}
                              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                              className="col-span-3"
                              placeholder="Item description"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="foodCategory" className="text-right">
                              Food Category
                            </Label>
                            <Select
                              value={newItem.foodCategory}
                              onValueChange={(value) => setNewItem({ ...newItem, foodCategory: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select food category" />
                              </SelectTrigger>
                              <SelectContent>
                                {foodCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category.replace(/_/g, " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                              className="col-span-3"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unit" className="text-right">
                              Unit
                            </Label>
                            <Select
                              value={newItem.unit}
                              onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {foodUnits.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddDialogOpen(false)
                              setNewItem({
                                name: "",
                                perStudent: "",
                                description: "",
                                foodCategory: "",
                                price: "",
                                unit: "",
                              })
                            }}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddItem}
                            disabled={isProcessing || !newItem.name || !newItem.perStudent || !newItem.description}
                          >
                            {isProcessing ? "Adding..." : "Add Item"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Per Student</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.perStudent}</TableCell>
                            <TableCell>
                              {item.foodCategory ? (
                                <Badge variant="outline">
                                  {item.foodCategory.replace(/_/g, " ")}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>{item.price ? `${item.price}` : "N/A"}</TableCell>
                            <TableCell>
                              {item.unit ? (
                                <Badge variant="secondary">{item.unit}</Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell className="max-w-md truncate">{item.description}</TableCell>
                            <TableCell>
                              {item.created ? new Date(item.created).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                  disabled={isProcessing}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={isProcessing}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No items found.
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
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
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
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setSelectedItem(null)
            setNewItem({
              name: "",
              perStudent: "",
              description: "",
              foodCategory: "",
              price: "",
              unit: "",
            })
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update item information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3"
                placeholder="Item name (e.g., Rice, Maize)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-perStudent" className="text-right">
                Per Student *
              </Label>
              <Input
                id="edit-perStudent"
                type="number"
                step="0.01"
                value={newItem.perStudent}
                onChange={(e) => setNewItem({ ...newItem, perStudent: e.target.value })}
                className="col-span-3"
                placeholder="0.1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description *
              </Label>
              <Textarea
                id="edit-description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="col-span-3"
                placeholder="Item description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-foodCategory" className="text-right">
                Food Category
              </Label>
              <Select
                value={newItem.foodCategory}
                onValueChange={(value) => setNewItem({ ...newItem, foodCategory: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select food category" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-unit" className="text-right">
                Unit
              </Label>
              <Select
                value={newItem.unit}
                onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {foodUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedItem(null)
                setNewItem({
                  name: "",
                  perStudent: "",
                  description: "",
                  foodCategory: "",
                  price: "",
                  unit: "",
                })
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateItem}
              disabled={isProcessing || !newItem.name || !newItem.perStudent || !newItem.description}
            >
              {isProcessing ? "Updating..." : "Update Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GovItems

