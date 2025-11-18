
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Edit,
  FileText,
  Home,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  Trash2,
  Truck,
  User,
  Users,
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
import { toast } from "@/components/ui/use-toast"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function ManageStockManagers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<any>(null)
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    phone: "",
    role: "stock-keeper",
    department: "",
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(7)

  const stockManagers = [
    {
      id: "SM-001",
      name: "Jean Baptiste Uwimana",
      email: "jean.uwimana@school.edu.rw",
      phone: "+250 788 123 456",
      role: "Senior Stock Keeper",
      department: "Kitchen Management",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2025-04-13 14:30",
    },
    {
      id: "SM-002",
      name: "Marie Claire Mukamana",
      email: "marie.mukamana@school.edu.rw",
      phone: "+250 788 654 321",
      role: "Stock Keeper",
      department: "Inventory Management",
      status: "active",
      joinDate: "2024-03-20",
      lastActive: "2025-04-13 16:45",
    },
    {
      id: "SM-003",
      name: "Paul Kagame Nzeyimana",
      email: "paul.nzeyimana@school.edu.rw",
      phone: "+250 788 987 654",
      role: "Assistant Stock Keeper",
      department: "Receiving & Distribution",
      status: "inactive",
      joinDate: "2024-06-10",
      lastActive: "2025-04-10 09:15",
    },
    {
      id: "SM-004",
      name: "Agnes Uwimana Gasana",
      email: "agnes.gasana@school.edu.rw",
      phone: "+250 788 111 222",
      role: "Stock Keeper",
      department: "Quality Control",
      status: "active",
      joinDate: "2024-08-05",
      lastActive: "2025-04-13 11:20",
    },
  ]

  const filteredManagers = stockManagers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.role.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleAddManager = () => {
    console.log("Adding new manager:", newManager)
    toast({
      title: "Stock Manager Added",
      description: "New stock manager has been successfully added to the system.",
    })
    setIsAddDialogOpen(false)
    setNewManager({
      name: "",
      email: "",
      phone: "",
      role: "stock-keeper",
      department: "",
    })
  }

  const handleEditManager = (manager: any) => {
    setSelectedManager(manager)
    setIsEditDialogOpen(true)
  }

  const handleDeleteManager = (managerId: string) => {
    console.log("Deleting manager:", managerId)
    toast({
      title: "Stock Manager Removed",
      description: "Stock manager has been removed from the system.",
      variant: "destructive",
    })
  }

  const handleToggleStatus = (managerId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    console.log(`Changing manager ${managerId} status to ${newStatus}`)
    toast({
      title: "Status Updated",
      description: `Stock manager status changed to ${newStatus}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
    ) : (
      <Badge variant="outline">Inactive</Badge>
    )
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/school-dashboard" className="lg:hidden">
            <Users className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Manage Stock Managers</h1>
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
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">School Administrator</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@school.edu.rw</p>
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
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-sm">
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
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Select
                        value={newManager.role}
                        onValueChange={(value) => setNewManager({ ...newManager, role: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senior-stock-keeper">Senior Stock Keeper</SelectItem>
                          <SelectItem value="stock-keeper">Stock Keeper</SelectItem>
                          <SelectItem value="assistant-stock-keeper">Assistant Stock Keeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Select
                        value={newManager.department}
                        onValueChange={(value) => setNewManager({ ...newManager, department: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kitchen-management">Kitchen Management</SelectItem>
                          <SelectItem value="inventory-management">Inventory Management</SelectItem>
                          <SelectItem value="receiving-distribution">Receiving & Distribution</SelectItem>
                          <SelectItem value="quality-control">Quality Control</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddManager}>
                      Add Manager
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stock Managers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Managers</CardTitle>
                <CardDescription>
                  Manage your school's stock management team members and their access levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                                  <AvatarImage src="/placeholder.svg" alt={manager.name} />
                                  <AvatarFallback>
                                    {manager.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{manager.name}</p>
                                  <p className="text-sm text-muted-foreground">{manager.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{manager.role}</TableCell>
                            <TableCell>{manager.department}</TableCell>
                            <TableCell>{getStatusBadge(manager.status)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{manager.lastActive}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditManager(manager)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(manager.id, manager.status)}
                                >
                                  {manager.status === "active" ? "Deactivate" : "Activate"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteManager(manager.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No stock managers found.
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
    </div>
  )
}
