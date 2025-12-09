
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface StockManager {
  id: string
  names?: string
  name?: string
  email: string
  phone?: string
  role?: string
  userStatus?: boolean | string
  school?: { id: string; name?: string }
  created?: string
  lastActive?: string
}

const stockManagerService = {
  getAllStockManagers: async (schoolId: string) => {
    const response = await apiClient.get(`/stockManager/all/${schoolId}`)
    return response.data
  },

  getStockManager: async (id: string) => {
    const response = await apiClient.get(`/stockManager/${id}`)
    return response.data
  },

  registerStockManager: async (stockManagerData: any) => {
    const response = await apiClient.post(`/stockManager/register`, stockManagerData)
    return response.data
  },

  updateStockManager: async (id: string, stockManagerData: any) => {
    const response = await apiClient.put(`/stockManager/update/${id}`, stockManagerData)
    return response.data
  },

  deleteStockManager: async (id: string) => {
    const response = await apiClient.delete(`/stockManager/delete/${id}`)
    return response.data
  },
}

export function ManageStockManagers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<StockManager | null>(null)
  const [stockManagers, setStockManagers] = useState<StockManager[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(7)

  useEffect(() => {
    const fetchStockManagers = async () => {
      try {
        setLoading(true)
        setError(null)
        const schoolId = localStorage.getItem("schoolId")
        if (!schoolId) {
          setError("School ID not found")
          return
        }
        const data = await stockManagerService.getAllStockManagers(schoolId)
        setStockManagers(data || [])
      } catch (err: any) {
        // If 404, treat as "no stock managers found" instead of an error
        if (err.response?.status === 404) {
          setStockManagers([])
          setError(null)
        } else {
          console.error("Error fetching stock managers:", err)
          setError(err.response?.data || "Failed to fetch stock managers")
          toast.error("Failed to load stock managers")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStockManagers()
  }, [])

  const filteredManagers = stockManagers.filter(
    (manager) => {
      const name = manager.names || manager.name || ""
      const email = manager.email || ""
      const role = manager.role || ""
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredManagers.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedManagers = filteredManagers.slice(startIndex, startIndex + pageSize)

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

  const handleAddManager = async () => {
    if (!newManager.name || !newManager.email || !newManager.phone || !newManager.password) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      const stockManagerPayload = {
        names: newManager.name,
        email: newManager.email,
        phone: newManager.phone,
        password: newManager.password,
        role: "STOCK_KEEPER",
        school: { id: schoolId },
        userStatus: true,
      }

      const createdManager = await stockManagerService.registerStockManager(stockManagerPayload)
      
      // Map backend response to frontend format
      const mappedManager: StockManager = {
        id: createdManager.id,
        names: createdManager.names,
        email: createdManager.email,
        phone: createdManager.phone,
        role: createdManager.role,
        userStatus: createdManager.userStatus,
        school: createdManager.school,
        created: createdManager.created,
      }

      setStockManagers([...stockManagers, mappedManager])
      toast.success("Stock manager added successfully")
      setIsAddDialogOpen(false)
      setNewManager({
        name: "",
        email: "",
        phone: "",
        password: "",
        department: "",
      })
    } catch (err: any) {
      console.error("Error adding stock manager:", err)
      const errorMessage = err.response?.data || "Failed to add stock manager"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to add stock manager")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditManager = (manager: StockManager) => {
    setSelectedManager(manager)
    setNewManager({
      name: manager.names || manager.name || "",
      email: manager.email || "",
      phone: manager.phone || "",
      password: "",
      department: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateManager = async () => {
    if (!selectedManager || !newManager.name || !newManager.email || !newManager.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      const stockManagerPayload: any = {
        names: newManager.name,
        email: newManager.email,
        phone: newManager.phone,
        role: "STOCK_KEEPER",
        school: { id: schoolId },
        userStatus: selectedManager.userStatus !== false,
      }

      // Only include password if it's provided
      if (newManager.password) {
        stockManagerPayload.password = newManager.password
      }

      const updatedManager = await stockManagerService.updateStockManager(selectedManager.id, stockManagerPayload)
      
      // Map backend response to frontend format
      const mappedManager: StockManager = {
        id: updatedManager.id,
        names: updatedManager.names,
        email: updatedManager.email,
        phone: updatedManager.phone,
        role: updatedManager.role,
        userStatus: updatedManager.userStatus,
        school: updatedManager.school,
        created: updatedManager.created,
      }

      setStockManagers(stockManagers.map(m => m.id === selectedManager.id ? mappedManager : m))
      toast.success("Stock manager updated successfully")
      setIsEditDialogOpen(false)
      setSelectedManager(null)
      setNewManager({
        name: "",
        email: "",
        phone: "",
        password: "",
        department: "",
      })
    } catch (err: any) {
      console.error("Error updating stock manager:", err)
      const errorMessage = err.response?.data || "Failed to update stock manager"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to update stock manager")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteManager = async (managerId: string) => {
    if (!window.confirm("Are you sure you want to delete this stock manager?")) {
      return
    }

    try {
      setIsProcessing(true)
      await stockManagerService.deleteStockManager(managerId)
      setStockManagers(stockManagers.filter(m => m.id !== managerId))
      toast.success("Stock manager deleted successfully")
    } catch (err: any) {
      console.error("Error deleting stock manager:", err)
      const errorMessage = err.response?.data || "Failed to delete stock manager"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to delete stock manager")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleStatus = async (manager: StockManager) => {
    try {
      setIsProcessing(true)
      const schoolId = localStorage.getItem("schoolId")
      if (!schoolId) {
        toast.error("School ID not found")
        return
      }

      const newStatus = manager.userStatus !== false
      const stockManagerPayload = {
        names: manager.names || manager.name || "",
        email: manager.email,
        phone: manager.phone || "",
        role: "STOCK_KEEPER",
        school: { id: schoolId },
        userStatus: !newStatus,
      }

      const updatedManager = await stockManagerService.updateStockManager(manager.id, stockManagerPayload)
      
      const mappedManager: StockManager = {
        id: updatedManager.id,
        names: updatedManager.names,
        email: updatedManager.email,
        phone: updatedManager.phone,
        role: updatedManager.role,
        userStatus: updatedManager.userStatus,
        school: updatedManager.school,
        created: updatedManager.created,
      }

      setStockManagers(stockManagers.map(m => m.id === manager.id ? mappedManager : m))
      toast.success(`Stock manager ${!newStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (err: any) {
      console.error("Error toggling status:", err)
      const errorMessage = err.response?.data || "Failed to update status"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to update status")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: boolean | string | undefined) => {
    const isActive = status === true || status === "active" || status === "ACTIVE"
    return isActive ? (
      <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
    ) : (
      <Badge variant="outline">Inactive</Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && stockManagers.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading stock managers</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/school-dashboard" className="lg:hidden">
            <Users className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Manage Stock Managers</h1>
          </div>
          <HeaderActions role="school" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            {/* Stock Managers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Managers</CardTitle>
                <CardDescription>
                  Manage your school's stock management team members and their access levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search stock managers..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Stock Manager
                        </Button>
                      </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Stock Manager</DialogTitle>
                    <DialogDescription>
                      Add a new stock manager to your school's inventory management team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newManager.name}
                        onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                        className="col-span-3"
                        placeholder="Full name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newManager.email}
                        onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                        className="col-span-3"
                        placeholder="email@school.edu.rw"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={newManager.phone}
                        onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                        className="col-span-3"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newManager.password}
                        onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                        className="col-span-3"
                        placeholder="Enter password (min 6 characters)"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setNewManager({
                          name: "",
                          email: "",
                          phone: "",
                          password: "",
                          department: "",
                        })
                      }}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      onClick={handleAddManager}
                      disabled={isProcessing || !newManager.name || !newManager.email || !newManager.phone || !newManager.password}
                    >
                      {isProcessing ? "Adding..." : "Add Manager"}
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
                        <TableHead>Manager</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredManagers.length > 0 ? (
                        paginatedManagers.map((manager) => (
                          <TableRow key={manager.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg" alt={manager.names || manager.name || ""} />
                                  <AvatarFallback>
                                    {(manager.names || manager.name || "")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{manager.names || manager.name || "N/A"}</p>
                                  <p className="text-sm text-muted-foreground">{manager.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{manager.role || "STOCK_KEEPER"}</TableCell>
                            <TableCell>{manager.school?.name || "N/A"}</TableCell>
                            <TableCell>{getStatusBadge(manager.userStatus)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{manager.created ? new Date(manager.created).toLocaleDateString() : "N/A"}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditManager(manager)}
                                  disabled={isProcessing}
                                  title="Edit Manager"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(manager)}
                                  disabled={isProcessing}
                                >
                                  {manager.userStatus !== false ? "Deactivate" : "Activate"}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDeleteManager(manager.id)}
                                  disabled={isProcessing}
                                  title="Delete Manager"
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
                            {stockManagers.length === 0 ? "No stock manager found" : "No stock managers found matching your search."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-sm">
                      Showing {filteredManagers.length === 0 ? 0 : startIndex + 1}–
                      {Math.min(startIndex + pageSize, filteredManagers.length)} of {filteredManagers.length}
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
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Stock Manager</DialogTitle>
            <DialogDescription>
              Update stock manager information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                className="col-span-3"
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={newManager.email}
                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                className="col-span-3"
                placeholder="email@school.edu.rw"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone *
              </Label>
              <Input
                id="edit-phone"
                value={newManager.phone}
                onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                className="col-span-3"
                placeholder="+250 788 123 456"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={newManager.password}
                onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                className="col-span-3"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedManager(null)
                setNewManager({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  department: "",
                })
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateManager}
              disabled={isProcessing || !newManager.name || !newManager.email || !newManager.phone}
            >
              {isProcessing ? "Updating..." : "Update Manager"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
