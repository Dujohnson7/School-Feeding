
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, LogOut, Package, Plus, Search, Settings, User, Edit, Trash2 } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useNavigate } from "react-router-dom"

interface Supplier {
  id: string
  companyName?: string
  name?: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  specialties?: string[]
  items?: Array<{ id: string; name?: string }>
  rating?: number
  status?: "active" | "inactive"
  state?: boolean
  tinNumber?: string
  bankName?: string
  bankAccount?: string
  district?: { id: string; name?: string }
  user?: { id: string; email?: string; phone?: string }
}

const API_BASE_URL = "http://localhost:8070/api/supplier"

const supplierService = {
  getAllSuppliers: async (districtId?: string) => {
    if (districtId) {
      const response = await axios.get(`${API_BASE_URL}/all/${districtId}`)
      return response.data
    }
    const response = await axios.get(`${API_BASE_URL}/all`)
    return response.data
  },

  getSupplier: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  },

  getSupplierItems: async (supplierId: string) => {
    const response = await axios.get(`${API_BASE_URL}/items/${supplierId}`)
    return response.data
  },

  deleteSupplier: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`)
    return response.data
  },
}

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        const districtId = localStorage.getItem("districtId")
        const data = await supplierService.getAllSuppliers(districtId || undefined)
        setSuppliers(data || [])
      } catch (err: any) {
        console.error("Error fetching suppliers:", err)
        setError(err.response?.data || "Failed to fetch suppliers")
        toast.error("Failed to load suppliers")
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    const name = supplier.companyName || supplier.name || ""
    const id = supplier.id || ""
    const specialties = supplier.items?.map(i => i.name || "").join(" ") || supplier.specialties?.join(" ") || ""
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialties.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleDeleteSupplier = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return
    }

    try {
      await supplierService.deleteSupplier(id)
      setSuppliers(suppliers.filter(s => s.id !== id))
      toast.success("Supplier deleted successfully")
    } catch (err: any) {
      console.error("Error deleting supplier:", err)
      toast.error(err.response?.data || "Failed to delete supplier")
    }
  }

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + pageSize)
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

  const handleAssignOrder = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setAssignDialogOpen(true)
  }

  const submitAssignment = () => {
    // In a real app, you would submit the assignment to your backend
    console.log(`Assigning order to ${selectedSupplier?.name}`)
    setAssignDialogOpen(false)
  }

  const getRatingStars = (rating?: number) => {
    if (!rating) return <span className="text-sm text-muted-foreground">No rating</span>
    
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {hasHalfStar && (
          <svg className="h-4 w-4" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}

        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <svg key={`empty-${i}`} className="h-4 w-4 fill-gray-300" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading suppliers</h2>
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
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Supplier Management</h1>
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
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">District Coordinator</p>
                    <p className="text-xs leading-none text-muted-foreground">coordinator@district.rw</p>
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
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Manage and assign orders to active suppliers</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search suppliers by name, ID, or specialty..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button  onClick={() => navigate("/add-supplier")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Supplier
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialties</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredSuppliers.length > 0 ? (
                      paginatedSuppliers.map((supplier) => (
                        <TableRow
                          key={supplier.id}
                          className={supplier.status === "inactive" ? "opacity-60" : ""}
                        >
                          <TableCell className="font-medium">{supplier.id?.substring(0, 8)}...</TableCell>
                          <TableCell>{supplier.companyName || supplier.name || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {supplier.items && supplier.items.length > 0 ? (
                                supplier.items.map((item) => (
                                  <Badge key={item.id} variant="outline">{item.name || item.id.substring(0, 8)}</Badge>
                                ))
                              ) : supplier.specialties && supplier.specialties.length > 0 ? (
                                supplier.specialties.map((s, idx) => (
                                  <Badge key={idx} variant="outline">{s}</Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No items</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{supplier.phone || supplier.contact || supplier.user?.phone || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">{supplier.email || supplier.user?.email || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">{supplier.address || "N/A"}</TableCell>
                          <TableCell>{getRatingStars(supplier.rating)}</TableCell>
                          <TableCell>
                            {supplier.state !== false && supplier.status !== "inactive" ? (
                              <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/add-supplier?edit=${supplier.id}`)}
                                title="Edit Supplier"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteSupplier(supplier.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                disabled={supplier.state === false || supplier.status === "inactive"}
                                onClick={() => handleAssignOrder(supplier)}
                              >
                                Assign
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No suppliers found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredSuppliers.length === 0 ? 0 : startIndex + 1}–
                    {Math.min(startIndex + pageSize, filteredSuppliers.length)} of {filteredSuppliers.length}
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      setPageSize(Number(v))
                      setPage(1)
                    }}
                  >
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
                        onClick={(e) => {
                          e.preventDefault()
                          if (canPrev) setPage((p) => p - 1)
                        }}
                        className={!canPrev ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(p)
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault()
                          if (canNext) setPage((p) => p + 1)
                        }}
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

      {/* Assign Order Dialog */}
      {selectedSupplier && (
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Order to Supplier</DialogTitle>
              <DialogDescription>Create a new order for {selectedSupplier.name}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="school">School</Label>
                <Select>
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kigali-primary">Kigali Primary School</SelectItem>
                    <SelectItem value="nyamirambo-secondary">Nyamirambo Secondary School</SelectItem>
                    <SelectItem value="remera-high">Remera High School</SelectItem>
                    <SelectItem value="gasabo-elementary">Gasabo Elementary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="items">Items</Label>
                <Select>
                  <SelectTrigger id="items">
                    <SelectValue placeholder="Select items" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSupplier.items && selectedSupplier.items.length > 0 ? (
                      selectedSupplier.items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name || item.id.substring(0, 8)}
                        </SelectItem>
                      ))
                    ) : selectedSupplier.specialties && selectedSupplier.specialties.length > 0 ? (
                      selectedSupplier.specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty.toLowerCase()}>
                          {specialty}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-items" disabled>No items available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>

              <div>
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input id="delivery-date" type="date" />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Any special instructions or requirements" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitAssignment}>Assign Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
