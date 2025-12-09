import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Edit, MoreHorizontal, Plus, Search, Settings, Shield, Trash2 } from "lucide-react"
import apiClient from "@/lib/axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { HeaderActions } from "@/components/shared/header-actions"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  id: string
  name: string
  email: string
  role: string
  userStatus: boolean | string
  created?: string
  companyName?: string
  names?: string
  profile?: string
  phone?: string
  password?: string
  district?: string | any
  school?: string | any
  province?: string
  tinNumber?: string
  address?: string
  bankName?: string
  bankAccount?: string
  items?: string[]  
}

// API_BASE_URL removed - using apiClient from @/lib/axios instead

interface District {
  id: string
  district: string  
  province: string  
  active?: boolean
  created?: string
  updated?: string
  createdBy?: string
  updatedBy?: string
}

interface School {
  id: string
  name: string
  district?: string
}

interface Item {
  id: string
  name: string
  category?: string
  unit?: string
}

const userService = {
  getAllUsers: async () => {
    const response = await apiClient.get(`/users/all`)
    return response.data
  },

  getProvinces: async () => {
    const response = await apiClient.get(`/users/province`)
    return response.data
  },

  getDistrictsByProvince: async (province: string) => {
    const response = await apiClient.get(`/users/districts-by-province`, {
      params: { province }
    })
    return response.data
  },

  getSchoolsByDistrict: async (districtEnum: string) => { 
    const response = await apiClient.get(`/users/schoolByDistrict`, {
      params: { district: districtEnum }
    })
    return response.data
  },

  getBanks: async () => {
    const response = await apiClient.get(`/users/bankName`)
    return response.data
  },

  getAllItems: async () => {
    const response = await apiClient.get(`/item/all`)
    return response.data
  },

  registerSupplier: async (supplierData: any) => {
    const response = await apiClient.post("/supplier/register", supplierData)
    return response.data
  },

  updateSupplier: async (id: string, supplierData: any) => {
    const response = await apiClient.put(`/supplier/update/${id}`, supplierData)
    return response.data
  },

  createUser: async (userData: Omit<User, 'id'>) => {
    const userPayload: any = {
      names: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      phone: userData.phone,
      userStatus: userData.userStatus === 'active' || userData.userStatus === true
    }
    
    if (userData.district) userPayload.district = { id: userData.district }
    if (userData.school) userPayload.school = { id: userData.school }
    if (userData.province) userPayload.province = userData.province
    if (userData.companyName) userPayload.companyName = userData.companyName
    if (userData.tinNumber) userPayload.tinNumber = userData.tinNumber
    if (userData.address) userPayload.address = userData.address
    if (userData.bankName) userPayload.bankName = userData.bankName
    if (userData.bankAccount) userPayload.bankAccount = userData.bankAccount
    
    const response = await apiClient.post(`/users/register`, userPayload)
    return response.data
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const userPayload: any = {
      names: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      userStatus: userData.userStatus === 'active' || userData.userStatus === true
    }
    
    if (userData.district) userPayload.district = { id: userData.district }
    if (userData.school) userPayload.school = { id: userData.school }
    if (userData.province) userPayload.province = userData.province
    if (userData.companyName) userPayload.companyName = userData.companyName
    if (userData.tinNumber) userPayload.tinNumber = userData.tinNumber
    if (userData.address) userPayload.address = userData.address
    if (userData.bankName) userPayload.bankName = userData.bankName
    if (userData.bankAccount) userPayload.bankAccount = userData.bankAccount
    
    const response = await apiClient.put(`/users/update/${id}`, userPayload)
    return response.data
  },

  changePassword: async (id: string, newPassword: string) => {
    const response = await apiClient.put(`/users/changePassword/${id}`, { 
      id,
      password: newPassword 
    })
    return response.data
  },

  suspendUser: async (id: string) => {
    const response = await apiClient.put(`/users/suspend/${id}`)
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/delete/${id}`)
    return response.data
  }
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [provinces, setProvinces] = useState<string[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [banks, setBanks] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])

  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: "",
    email: "",
    role: "",
    district: "",
    phone: "",
    school: "",
    password: "",
    userStatus: "active",
    province: "",
    tinNumber: "",
    companyName: "",
    address: "",
    bankName: "",
    bankAccount: "",
    items: []
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await userService.getAllUsers()
        setUsers(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Failed to load users. Please try again later.')
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    const fetchInitialData = async () => {
      try {
        const [provincesData, banksData, itemsData] = await Promise.all([
          userService.getProvinces(),
          userService.getBanks(),
          userService.getAllItems()
        ])
        setProvinces(provincesData)
        setBanks(banksData)
        setItems(itemsData)
      } catch (err) {
        console.error('Failed to fetch initial data:', err)
      }
    }

    fetchUsers()
    fetchInitialData()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      if (newUser.province) {
        try {
          const districtsData = await userService.getDistrictsByProvince(newUser.province)
          setDistricts(districtsData)
          setNewUser(prev => ({ ...prev, district: "", school: "" }))
        } catch (err) {
          console.error('Failed to fetch districts:', err)
          toast.error('Failed to load districts')
        }
      } else {
        setDistricts([])
        setNewUser(prev => ({ ...prev, district: "", school: "" }))
      }
    }

    fetchDistricts()
  }, [newUser.province])

  useEffect(() => {
    const fetchSchools = async () => {
      if (newUser.district && newUser.province) {
        try {
          const selectedDistrict = districts.find(d => d.id === newUser.district)
          if (selectedDistrict) {
            const schoolsData = await userService.getSchoolsByDistrict(selectedDistrict.district)
            setSchools(schoolsData)
          }
          setNewUser(prev => ({ ...prev, school: "" }))
        } catch (err) {
          console.error('Failed to fetch schools:', err)
          toast.error('Failed to load schools')
        }
      } else {
        setSchools([])
        setNewUser(prev => ({ ...prev, school: "" }))
      }
    }

    fetchSchools()
  }, [newUser.district, districts, newUser.province])

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase()
    const name = user?.name?.toLowerCase() || ''
    const email = user?.email?.toLowerCase() || ''

    const matchesSearch = name.includes(searchTermLower) ||
      email.includes(searchTermLower)

    const matchesRole = selectedRole === "all" || user?.role === selectedRole

    return matchesSearch && matchesRole
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedRole])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  const canPrev = page > 1
  const canNext = page < totalPages

  const getPageWindow = () => {
    const maxButtons = 5
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, page - half)
    let end = Math.min(totalPages, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1)
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsProcessing(true)
      const createdUser = await userService.createUser(newUser)
      
      if (newUser.role === "SUPPLIER" && createdUser.id) {
        try {
          const selectedDistrict = districts.find(d => d.id === newUser.district)
          const supplierPayload = {
            user: { id: createdUser.id },
            companyName: newUser.companyName,
            tinNumber: newUser.tinNumber,
            address: newUser.address,
            bankName: newUser.bankName,
            bankAccount: newUser.bankAccount,
            district: selectedDistrict ? { id: selectedDistrict.id } : null,
            items: newUser.items?.map(itemId => ({ id: itemId })) || []
          }
          await userService.registerSupplier(supplierPayload)
        } catch (supplierErr) {
          console.error('Error registering supplier:', supplierErr)
        }
      }
      
      const mappedUser = {
        ...createdUser,
        id: createdUser.id,
        name: createdUser.names || '',
        userStatus: createdUser.userStatus ? 'active' : 'inactive'
      }
      setUsers([...users, mappedUser])
      setIsAddUserOpen(false)
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        district: "",
        phone: "",
        school: "",
        userStatus: "active",
        province: "",
        tinNumber: "",
        companyName: "",
        address: "",
        bankName: "",
        bankAccount: "",
        items: []
      })
      toast.success('User created successfully')
    } catch (error: any) {
      console.error('Error creating user:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create user. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditUser = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setEditingUserId(userId)
      const userProvince = user.province || (typeof user.district === 'object' ? user.district?.province : null) || ""
      const userDistrict = typeof user.district === 'string' 
        ? user.district 
        : (typeof user.district === 'object' ? user.district?.id : null) || ""
      const userSchool = typeof user.school === 'string' ? user.school : user.school?.id || ""
      
      setNewUser({
        name: user.name || user.names || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
        district: userDistrict,
        school: userSchool,
        password: "", 
        userStatus: user.userStatus === true || user.userStatus === 'active' ? 'active' : 'inactive',
        province: userProvince,
        tinNumber: user.tinNumber || "",
        companyName: user.companyName || "",
        address: user.address || "",
        bankName: user.bankName || "",
        bankAccount: user.bankAccount || "",
        items: user.items || []
      })
      
      if (user.role === "SUPPLIER" && userId) {
        try {
          const suppliersResponse = await apiClient.get(`/supplier/all`)
          const supplier = suppliersResponse.data.find((s: any) => s.user?.id === userId)
          if (supplier) {
            const itemsResponse = await apiClient.get(`/supplier/items/${supplier.id}`)
            const supplierItems = itemsResponse.data.map((item: Item) => item.id)
            setNewUser(prev => ({ ...prev, items: supplierItems }))
          }
        } catch (err) {
          console.error('Failed to fetch supplier items:', err)
        }
      }
      
      if (userProvince) {
        try {
          const districtsData = await userService.getDistrictsByProvince(userProvince)
          setDistricts(districtsData)
        } catch (err) {
          console.error('Failed to fetch districts:', err)
        }
      }
      
      if (userDistrict && userProvince) {
        try {
          const districtsData = await userService.getDistrictsByProvince(userProvince)
          const selectedDistrict = districtsData.find((d: District) => d.id === userDistrict)
          if (selectedDistrict) {
            const schoolsData = await userService.getSchoolsByDistrict(selectedDistrict.district)
            setSchools(schoolsData)
          }
        } catch (err) {
          console.error('Failed to fetch schools:', err)
        }
      }
      
      setIsEditUserOpen(true)
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUserId) return
    
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsProcessing(true)
      const updatedUser = await userService.updateUser(editingUserId, newUser)
      
      if (newUser.role === "SUPPLIER" && editingUserId) {
        try {
          const suppliersResponse = await apiClient.get(`/supplier/all`)
          const supplier = suppliersResponse.data.find((s: any) => s.user?.id === editingUserId)
          
          if (supplier) {
            const selectedDistrict = districts.find(d => d.id === newUser.district)
            const supplierPayload = {
              user: { id: editingUserId },
              companyName: newUser.companyName,
              tinNumber: newUser.tinNumber,
              address: newUser.address,
              bankName: newUser.bankName,
              bankAccount: newUser.bankAccount,
              district: selectedDistrict ? { id: selectedDistrict.id } : null,
              items: newUser.items?.map(itemId => ({ id: itemId })) || []
            }
            await userService.updateSupplier(supplier.id, supplierPayload)
          } else {
            const selectedDistrict = districts.find(d => d.id === newUser.district)
            const supplierPayload = {
              user: { id: editingUserId },
              companyName: newUser.companyName,
              tinNumber: newUser.tinNumber,
              address: newUser.address,
              bankName: newUser.bankName,
              bankAccount: newUser.bankAccount,
              district: selectedDistrict ? { id: selectedDistrict.id } : null,
              items: newUser.items?.map(itemId => ({ id: itemId })) || []
            }
            await userService.registerSupplier(supplierPayload)
          }
        } catch (supplierErr) {
          console.error('Error updating supplier:', supplierErr)
        }
      }
      
      const mappedUser = {
        ...updatedUser,
        id: updatedUser.id,
        name: updatedUser.names || updatedUser.name || '',
        userStatus: updatedUser.userStatus ? 'active' : 'inactive'
      }
      setUsers(users.map(user => user.id === editingUserId ? mappedUser : user))
      setIsEditUserOpen(false)
      setEditingUserId(null)
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        district: "",
        phone: "",
        school: "",
        userStatus: "active",
        province: "",
        tinNumber: "",
        companyName: "",
        address: "",
        bankName: "",
        bankAccount: "",
        items: []
      })
      toast.success('User updated successfully')
    } catch (error: any) {
      console.error('Error updating user:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update user. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetPasswordUserId) return

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setIsProcessing(true)
      await userService.changePassword(resetPasswordUserId, newPassword)
      setIsResetPasswordOpen(false)
      setResetPasswordUserId(null)
      setNewPassword("")
      setConfirmPassword("")
      toast.success('Password updated successfully')
    } catch (error: any) {
      console.error('Error resetting password:', error)
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUserAction = async (action: string, userId: string) => {
    try {
      setIsProcessing(true)

      switch (action) {
        case 'Edit':
          handleEditUser(userId)
          setIsProcessing(false) 
          return 

        case 'Suspend':
          await userService.suspendUser(userId)
          setUsers(users.map(user =>
            user.id === userId ? { ...user, userStatus: false } : user
          ))
          toast.success('User suspended successfully')
          break

        case 'Activate':
          await userService.updateUser(userId, { userStatus: 'active' })
          setUsers(users.map(user =>
            user.id === userId ? { ...user, userStatus: 'active' } : user
          ))
          toast.success('User activated successfully')
          break

        case 'Delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await userService.deleteUser(userId)
            setUsers(users.filter(user => user.id !== userId))
            toast.success('User deleted successfully')
          }
          break

        case 'Reset Password':
          setResetPasswordUserId(userId)
          setIsResetPasswordOpen(true)
          setIsProcessing(false) 
          return 
      }
    } catch (error: any) {
      console.error(`Error ${action.toLowerCase()} user:`, error)
      const errorMessage = error.response?.data?.message || `Failed to ${action.toLowerCase()} user. Please try again.`
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
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
          <h2 className="text-xl font-semibold text-destructive">Error loading users</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Link to="/admin-dashboard" className="lg:hidden">
          <Shield className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold">Users Management</h1>
        </div>
        <HeaderActions role="admin" />
      </header>
      <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto min-w-0">
        <div className="flex flex-col gap-4 h-full">
          <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
                <div className="space-y-1">
                  <CardTitle>Users</CardTitle>
                  <CardDescription className="hidden sm:block">Manage all system users and their permissions</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[150px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="GOV">Government Official</SelectItem>
                        <SelectItem value="DISTRICT">District Coordinator</SelectItem>
                        <SelectItem value="SCHOOL">School Administrator</SelectItem>
                        <SelectItem value="STOCK_KEEPER">Stock Manager</SelectItem>
                        <SelectItem value="SUPPLIER">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddUserOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto min-h-0">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <Table className="min-w-[800px] md:min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                        <TableHead className="hidden md:table-cell">Organisation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8"><AvatarImage
                                  src={
                                    user?.profile
                                      ? `http://localhost:8070/uploads/${user.profile}`
                                      : "/userIcon.png"
                                  }
                                  alt={user?.name || "User"}
                                />

                                  <AvatarFallback>
                                    {user?.name
                                      ? user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                      : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                  <div className="text-xs text-muted-foreground sm:hidden">{user.role}</div>
                                  <div className="text-xs text-muted-foreground md:hidden">
                                    {user.role === 'ADMIN'
                                      ? 'System Administration'
                                      : user.role === 'GOV'
                                        ? 'MINEDUC'
                                        : user.role === 'DISTRICT' && user.district
                                          ? `${user.district.district} District`
                                          : user.role === 'SCHOOL' || user.role === 'STOCK_KEEPER' && user.school
                                            ? user.school.name
                                            : user.role === 'SUPPLIER' && user.companyName
                                              ? user.companyName
                                              : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{user.role}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.role === 'ADMIN'
                                ? 'System Administration'
                                : user.role === 'GOV'
                                  ? 'MINEDUC'
                                  : user.role === 'DISTRICT' && user.district
                                    ? `${user.district.district} District`
                                    : user.role === 'SCHOOL' || user.role === 'STOCK_KEEPER' && user.school
                                      ? user.school.name
                                      : user.role === 'SUPPLIER' && user.companyName
                                        ? user.companyName
                                        : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.userStatus ? 'default' : 'destructive'}>
                                {user.userStatus ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{user.created ? new Date(user.created).toLocaleDateString() : "—"}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleUserAction("Edit", user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("Reset Password", user.id)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.userStatus === "active" ? (
                                  <DropdownMenuItem onClick={() => handleUserAction("Suspend", user.id)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUserAction("Activate", user.id)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleUserAction("Delete", user.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium hidden sm:block">Rows per page</p>
                  <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50, 100].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Pagination className="w-full sm:w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (canPrev) setPage((p) => p - 1)
                        }}
                        className={!canPrev ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {getPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(p)
                          }}
                          isActive={p === page}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (canNext) setPage((p) => p + 1)
                        }}
                        className={!canNext ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account for the system.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">System Administrator</SelectItem>
                  <SelectItem value="GOV">Government Official</SelectItem>
                  <SelectItem value="DISTRICT">District Coordinator</SelectItem>
                  <SelectItem value="SCHOOL">School Administrator</SelectItem>
                  <SelectItem value="STOCK_KEEPER">Stock Manager</SelectItem>
                  <SelectItem value="SUPPLIER">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            
            {(newUser.role === "DISTRICT" || newUser.role === "SCHOOL") && (
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Select value={newUser.province} onValueChange={(value) => setNewUser({ ...newUser, province: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(newUser.role === "DISTRICT" || newUser.role === "SCHOOL" || newUser.role === "SUPPLIER") && (
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Select 
                  value={newUser.district} 
                  onValueChange={(value) => setNewUser({ ...newUser, district: value })}
                  disabled={!newUser.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={newUser.province ? "Select District" : "Select Province first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(newUser.role === "SCHOOL" || newUser.role === "STOCK_KEEPER") && (
              <div className="grid gap-2">
                <Label htmlFor="school">School</Label>
                <Select 
                  value={newUser.school} 
                  onValueChange={(value) => setNewUser({ ...newUser, school: value })}
                  disabled={!newUser.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={newUser.district ? "Select School" : "Select District first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}


            
            {newUser.role === "SUPPLIER"  && (
              <div className="grid gap-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                  id="tinNumber"
                  value={newUser.tinNumber}
                  onChange={(e) => setNewUser({ ...newUser, tinNumber: e.target.value })}
                  placeholder="Enter TIN Number"
                  required
                />
              </div>
            )}
 
            
            {newUser.role === "SUPPLIER"  && (
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={newUser.companyName}
                  onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                  placeholder="Enter Company Name"
                  required
                />
              </div>
            )}
 
            {newUser.role === "SUPPLIER"  && (
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="Enter Address"
                  required
                />
              </div>
            )}
 
            {newUser.role === "SUPPLIER"  && (
              <div className="grid gap-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Select value={newUser.bankName} onValueChange={(value) => setNewUser({ ...newUser, bankName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bank Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {newUser.role === "SUPPLIER"  && (
              <div className="grid gap-2">
                <Label htmlFor="bankAccount">Bank Account Number</Label>
                <Input
                  id="bankAccount"
                  value={newUser.bankAccount}
                  onChange={(e) => setNewUser({ ...newUser, bankAccount: e.target.value })}
                  placeholder="Enter Bank Account Number"
                  required
                />
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label>Items *</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={newUser.items?.includes(item.id) || false}
                            onCheckedChange={(checked) => {
                              const currentItems = newUser.items || []
                              if (checked) {
                                setNewUser({ ...newUser, items: [...currentItems, item.id] })
                              } else {
                                setNewUser({ ...newUser, items: currentItems.filter(id => id !== item.id) })
                              }
                            }}
                          />
                          <label
                            htmlFor={`item-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {item.name} {item.category && `(${item.category})`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items available</p>
                  )}
                </div>
              </div>
            )}

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={isProcessing || !newUser.name || !newUser.email || !newUser.role || !newUser.password}
            >
              {isProcessing ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user account information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">System Administrator</SelectItem>
                  <SelectItem value="GOV">Government Official</SelectItem>
                  <SelectItem value="DISTRICT">District Coordinator</SelectItem>
                  <SelectItem value="SCHOOL">School Administrator</SelectItem>
                  <SelectItem value="STOCK_KEEPER">Stock Manager</SelectItem>
                  <SelectItem value="SUPPLIER">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newUser.role === "DISTRICT" || newUser.role === "SCHOOL") && (
              <div className="grid gap-2">
                <Label htmlFor="edit-province">Province</Label>
                <Select value={newUser.province} onValueChange={(value) => setNewUser({ ...newUser, province: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(newUser.role === "DISTRICT" || newUser.role === "SCHOOL" || newUser.role === "SUPPLIER") && (
              <div className="grid gap-2">
                <Label htmlFor="edit-district">District</Label>
                <Select 
                  value={newUser.district} 
                  onValueChange={(value) => setNewUser({ ...newUser, district: value })}
                  disabled={!newUser.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={newUser.province ? "Select District" : "Select Province first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(newUser.role === "SCHOOL" || newUser.role === "STOCK_KEEPER") && (
              <div className="grid gap-2">
                <Label htmlFor="edit-school">School</Label>
                <Select 
                  value={newUser.school} 
                  onValueChange={(value) => setNewUser({ ...newUser, school: value })}
                  disabled={!newUser.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={newUser.district ? "Select School" : "Select District first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-tinNumber">TIN Number</Label>
                <Input
                  id="edit-tinNumber"
                  value={newUser.tinNumber}
                  onChange={(e) => setNewUser({ ...newUser, tinNumber: e.target.value })}
                  placeholder="Enter TIN Number"
                />
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-companyName">Company Name</Label>
                <Input
                  id="edit-companyName"
                  value={newUser.companyName}
                  onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                  placeholder="Enter Company Name"
                />
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="Enter Address"
                />
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-bankName">Bank Name</Label>
                <Select value={newUser.bankName} onValueChange={(value) => setNewUser({ ...newUser, bankName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bank Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-bankAccount">Bank Account Number</Label>
                <Input
                  id="edit-bankAccount"
                  value={newUser.bankAccount}
                  onChange={(e) => setNewUser({ ...newUser, bankAccount: e.target.value })}
                  placeholder="Enter Bank Account Number"
                />
              </div>
            )}

            {newUser.role === "SUPPLIER" && (
              <div className="grid gap-2">
                <Label>Items *</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-item-${item.id}`}
                            checked={newUser.items?.includes(item.id) || false}
                            onCheckedChange={(checked) => {
                              const currentItems = newUser.items || []
                              if (checked) {
                                setNewUser({ ...newUser, items: [...currentItems, item.id] })
                              } else {
                                setNewUser({ ...newUser, items: currentItems.filter(id => id !== item.id) })
                              }
                            }}
                          />
                          <label
                            htmlFor={`edit-item-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {item.name} {item.category && `(${item.category})`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items available</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditUserOpen(false)
                setEditingUserId(null)
                setNewUser({
                  name: "",
                  email: "",
                  role: "",
                  password: "",
                  district: "",
                  phone: "",
                  school: "",
                  userStatus: "active",
                  province: "",
                  tinNumber: "",
                  companyName: "",
                  address: "",
                  bankName: "",
                  bankAccount: "",
                  items: []
                })
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isProcessing || !newUser.name || !newUser.email || !newUser.role}
            >
              {isProcessing ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter a new password for this user (minimum 6 characters).</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsResetPasswordOpen(false)
                setResetPasswordUserId(null)
                setNewPassword("")
                setConfirmPassword("")
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={isProcessing || !newPassword || !confirmPassword || newPassword.length < 6}
            >
              {isProcessing ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}