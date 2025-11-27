import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  LogOut,
  Package,
  Settings,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import axios from "axios"

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
import { toast } from "@/components/ui/use-toast"
import { logout } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:8070/api/item"

interface Item {
  id: string
  name: string
  perStudent: number
  description: string
  active: boolean
  created?: string
  updated?: string
}

const itemService = {
  getAllItems: async () => {
    const response = await axios.get(`${API_BASE_URL}/all`)
    return response.data
  },

  getItem: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  },

  registerItem: async (itemData: any) => {
    const response = await axios.post(`${API_BASE_URL}/register`, itemData)
    return response.data
  },

  updateItem: async (id: string, itemData: any) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, itemData)
    return response.data
  },

  deleteItem: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`)
    return response.data
  },
}

export function GovItems() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const [newItem, setNewItem] = useState({
    name: "",
    perStudent: "",
    description: "", 
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await itemService.getAllItems()
      setItems(data || [])
    } catch (err: any) {
      console.error("Error fetching items:", err)
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout(navigate)
  }

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.perStudent || !newItem.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      const itemPayload = {
        name: newItem.name,
        perStudent: Number(newItem.perStudent),
        description: newItem.description, 
      }

      await itemService.registerItem(itemPayload)
      toast({
        title: "Success",
        description: "Item added successfully",
      })
      setIsAddDialogOpen(false)
      setNewItem({
        name: "",
        perStudent: "",
        description: "",
      })
      fetchItems()
    } catch (err: any) {
      console.error("Error adding item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to add item"
      toast({
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Failed to add item",
        variant: "destructive",
      })
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
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateItem = async () => {
    if (!selectedItem || !newItem.name || !newItem.perStudent || !newItem.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      const itemPayload = {
        name: newItem.name,
        perStudent: Number(newItem.perStudent),
        description: newItem.description,
      }

      await itemService.updateItem(selectedItem.id, itemPayload)
      toast({
        title: "Success",
        description: "Item updated successfully",
      })
      setIsEditDialogOpen(false)
      setSelectedItem(null)
      setNewItem({
        name: "",
        perStudent: "",
        description: "",
      })
      fetchItems()
    } catch (err: any) {
      console.error("Error updating item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to update item"
      toast({
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Failed to update item",
        variant: "destructive",
      })
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
      await itemService.deleteItem(itemId)
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      fetchItems()
    } catch (err: any) {
      console.error("Error deleting item:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to delete item"
      toast({
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

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
                    <AvatarFallback>GO</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Government Official</p>
                    <p className="text-xs leading-none text-muted-foreground">gov@mineduc.gov.rw</p>
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-sm">
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  Manage all food items in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Per Student</TableHead>
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
                          <TableCell colSpan={6} className="h-24 text-center">
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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

