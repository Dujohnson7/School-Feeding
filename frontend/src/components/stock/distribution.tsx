
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

interface DistributionRecord {
  id: string
  date: string
  destination: string
  items: string[]
  quantities: string[]
  requestedBy: string
  status: "pending" | "completed" | "cancelled"
  notes: string
}

export function StockDistribution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionRecord | null>(null)
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false)
  const [newDistributionOpen, setNewDistributionOpen] = useState(false)

  // Sample data
  const distributions: DistributionRecord[] = [
    {
      id: "DIST-2025-042",
      date: "Apr 15, 2025",
      destination: "Kitchen",
      items: ["Rice", "Beans", "Vegetables"],
      quantities: ["25kg", "15kg", "10kg"],
      requestedBy: "Head Chef",
      status: "pending",
      notes: "For lunch preparation",
    },
    {
      id: "DIST-2025-041",
      date: "Apr 15, 2025",
      destination: "Kitchen",
      items: ["Maize", "Oil"],
      quantities: ["20kg", "5L"],
      requestedBy: "Head Chef",
      status: "pending",
      notes: "For dinner preparation",
    },
    {
      id: "DIST-2025-040",
      date: "Apr 14, 2025",
      destination: "Kitchen",
      items: ["Rice", "Beans", "Vegetables"],
      quantities: ["25kg", "15kg", "10kg"],
      requestedBy: "Head Chef",
      status: "completed",
      notes: "For lunch preparation",
    },
    {
      id: "DIST-2025-039",
      date: "Apr 14, 2025",
      destination: "Kitchen",
      items: ["Maize", "Oil"],
      quantities: ["20kg", "5L"],
      requestedBy: "Head Chef",
      status: "completed",
      notes: "For dinner preparation",
    },
    {
      id: "DIST-2025-038",
      date: "Apr 13, 2025",
      destination: "Kitchen",
      items: ["Rice", "Beans", "Vegetables"],
      quantities: ["25kg", "15kg", "10kg"],
      requestedBy: "Head Chef",
      status: "cancelled",
      notes: "Cancelled due to school closure",
    },
  ]

  // Filter distributions based on search term and status filter
  const filteredDistributions = distributions.filter((distribution) => {
    const matchesSearch =
      distribution.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || distribution.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDistribute = () => {
    // In a real app, this would update the distribution status and deduct items from inventory
    console.log(`Processing distribution ${selectedDistribution?.id}`)
    setDistributeDialogOpen(false)
  }

  const handleCreateDistribution = () => {
    // In a real app, this would create a new distribution record
    console.log("Creating new distribution")
    setNewDistributionOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Receiving
            </Link>
            <Link
              to="/stock-distribution"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
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
        <main className="flex-1 overflow-auto p-4 md:p-6">
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
                      filteredDistributions.map((distribution) => (
                        <TableRow key={distribution.id}>
                          <TableCell className="font-medium">{distribution.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {distribution.date}
                            </div>
                          </TableCell>
                          <TableCell>{distribution.destination}</TableCell>
                          <TableCell>
                            {distribution.items.map((item, index) => (
                              <div key={index}>
                                {item} ({distribution.quantities[index]})
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>{distribution.requestedBy}</TableCell>
                          <TableCell>{getStatusBadge(distribution.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDistribution(distribution)
                                setDistributeDialogOpen(true)
                              }}
                              disabled={distribution.status !== "pending"}
                            >
                              {distribution.status === "pending" ? "Process" : "View Details"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No distributions found.
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
                  <p className="font-medium">{selectedDistribution.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedDistribution.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destination</p>
                  <p>{selectedDistribution.destination}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                  <p>{selectedDistribution.requestedBy}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>To Distribute</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDistribution.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item}</TableCell>
                          <TableCell>{selectedDistribution.quantities[index]}</TableCell>
                          <TableCell>
                            {item === "Rice" && "1,200kg"}
                            {item === "Beans" && "850kg"}
                            {item === "Vegetables" && "120kg"}
                            {item === "Maize" && "950kg"}
                            {item === "Oil" && "80L"}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              defaultValue={selectedDistribution.quantities[index]}
                              className="h-8 w-24"
                            />
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
                  placeholder="Add any notes about this distribution"
                  defaultValue={selectedDistribution.notes}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDistributeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDistribute}>
                <Check className="mr-2 h-4 w-4" />
                Process Distribution
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
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select>
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
              <Label htmlFor="requested-by">Requested By</Label>
              <Input id="requested-by" placeholder="Name of requester" />
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
                        <SelectItem value="oil">Oil</SelectItem>
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
                      <Plus className="h-4 w-4" />
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
              <Textarea id="notes" placeholder="Add any notes about this distribution" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDistributionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDistribution}>Create Distribution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
