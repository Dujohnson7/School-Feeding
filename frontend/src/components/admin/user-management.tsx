
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Edit,
  FileText,
  Home,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  avatar?: string
}

export function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  })

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Jean Baptiste Uwimana",
      email: "jean.uwimana@school.edu.rw",
      role: "School Administrator",
      status: "active",
      lastLogin: "2 hours ago",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Marie Claire Mukamana",
      email: "marie.mukamana@district.rw",
      role: "District Coordinator",
      status: "active",
      lastLogin: "1 day ago",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Robert Niyonzima",
      email: "robert.niyonzima@mineduc.gov.rw",
      role: "Government Official",
      status: "active",
      lastLogin: "3 hours ago",
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      name: "Sarah Yusuf",
      email: "sarah.yusuf@freshfoods.rw",
      role: "Supplier",
      status: "inactive",
      lastLogin: "1 week ago",
      createdAt: "2024-01-20",
    },
    {
      id: "5",
      name: "David Mugisha",
      email: "david.mugisha@school.edu.rw",
      role: "Stock Manager",
      status: "active",
      lastLogin: "30 minutes ago",
      createdAt: "2024-01-25",
    },
    {
      id: "6",
      name: "Grace Uwimana",
      email: "grace.uwimana@gmail.com",
      role: "Parent",
      status: "suspended",
      lastLogin: "2 weeks ago",
      createdAt: "2024-01-12",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    console.log("Adding new user:", newUser)
    toast({
      title: "User Added",
      description: `${newUser.name} has been successfully added to the system.`,
    })
    setIsAddUserOpen(false)
    setNewUser({ name: "", email: "", role: "", password: "" })
  }

  const handleUserAction = (action: string, userId: string, userName: string) => {
    console.log(`${action} user:`, userId)
    toast({
      title: `User ${action}`,
      description: `${userName} has been ${action.toLowerCase()}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">System Admin</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/admin-users"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              User Management
            </Link>
            <Link
              to="/admin-logs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Audit Logs
            </Link>
            <Link
              to="/admin-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              System Settings
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
            <Shield className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">User Management</h1>
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
                    <p className="text-sm font-medium leading-none">System Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@system.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
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
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage system users and their permissions</p>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account for the system.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Government Official">Government Official</SelectItem>
                          <SelectItem value="District Coordinator">District Coordinator</SelectItem>
                          <SelectItem value="School Administrator">School Administrator</SelectItem>
                          <SelectItem value="Stock Manager">Stock Manager</SelectItem>
                          <SelectItem value="Supplier">Supplier</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddUser}>
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Government Official">Government Official</SelectItem>
                      <SelectItem value="District Coordinator">District Coordinator</SelectItem>
                      <SelectItem value="School Administrator">School Administrator</SelectItem>
                      <SelectItem value="Stock Manager">Stock Manager</SelectItem>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>Manage all system users and their access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleUserAction("Edit", user.id, user.name)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction("Reset Password", user.id, user.name)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleUserAction("Suspend", user.id, user.name)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction("Activate", user.id, user.name)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleUserAction("Delete", user.id, user.name)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
