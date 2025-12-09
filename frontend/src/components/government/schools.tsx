import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {  Package,  Plus,  Search,  Edit,  Trash2,  Loader2,  Eye,
} from "lucide-react"
import apiClient from "@/lib/axios"

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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"

interface District {
  id: string
  province: string
  district: string
  active: boolean
}

interface School {
  id: string
  name: string
  directorNames: string
  email: string
  phone: string
  address: string
  student: number
  bankAccount: string
  status: boolean
  district: District
  bank?: any 
}

const schoolService = {
  getAllSchools: async () => {
    const response = await apiClient.get(`/school/all`)
    return response.data
  },

  getSchool: async (id: string) => {
    const response = await apiClient.get(`/school/${id}`)
    return response.data
  },

  registerSchool: async (schoolData: any) => {
    const response = await apiClient.post(`/school/register`, schoolData)
    return response.data
  },

  updateSchool: async (id: string, schoolData: any) => {
    const response = await apiClient.put(`/school/update/${id}`, schoolData)
    return response.data
  },

  deleteSchool: async (id: string) => {
    const response = await apiClient.delete(`/school/delete/${id}`)
    return response.data
  },
}

const schoolApiService = {
  getProvinces: async () => {
    const response = await apiClient.get(`/school/province`)
    return response.data
  },

  getDistrictsByProvince: async (province: string) => {
    const response = await apiClient.get(`/school/districts-by-province`, {
      params: { province }
    })
    return response.data
  },

  getBanks: async () => {
    const response = await apiClient.get(`/school/bankName`)
    return response.data
  },
}

export function GovSchools() {
  const [searchTerm, setSearchTerm] = useState("")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [schools, setSchools] = useState<School[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])
  const [allDistricts, setAllDistricts] = useState<District[]>([])
  const [banks, setBanks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const [newSchool, setNewSchool] = useState({
    name: "",
    directorNames: "",
    email: "",
    phone: "",
    address: "",
    student: "",
    bank: "",
    bankAccount: "",
    status: true,
    province: "",
    districtId: "",
  })

  const fetchAllDistricts = async () => {
    try {
      const allProvinces = await schoolApiService.getProvinces()
      const districtsPromises = allProvinces.map((province: string) => 
        schoolApiService.getDistrictsByProvince(province)
      )
      const districtsArrays = await Promise.all(districtsPromises)
      const allDistrictsList = districtsArrays.flat()
      setAllDistricts(allDistrictsList)
    } catch (err: any) {
      console.error('Failed to fetch all districts:', err)
    }
  }

  useEffect(() => {
    fetchSchools()
    fetchProvinces()
    fetchBanks()
    fetchAllDistricts()
  }, [])

  useEffect(() => {
    if (newSchool.province) {
      fetchDistrictsByProvince(newSchool.province)
    } else {
      setAvailableDistricts([])
      setNewSchool({ ...newSchool, districtId: "" })
    }
  }, [newSchool.province])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const data = await schoolService.getAllSchools()
      setSchools(data || [])
    } catch (err: any) {
      toast.error("Failed to load schools")
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    try {
      const data = await schoolApiService.getProvinces()
      const provinceValues = Array.isArray(data) ? data.map((p: any) => typeof p === 'string' ? p : p.toString()) : []
      setProvinces(provinceValues)
    } catch (err: any) {
      toast.error("Failed to load provinces")
    }
  }

  const fetchDistrictsByProvince = async (province: string) => {
    try {
      const data = await schoolApiService.getDistrictsByProvince(province)
      setAvailableDistricts(data || [])
    } catch (err: any) {
      setAvailableDistricts([])
    }
  }

  const fetchBanks = async () => {
    try {
      const data = await schoolApiService.getBanks()
      const bankValues = Array.isArray(data) ? data.map((b: any) => typeof b === 'string' ? b : b.toString()) : []
      setBanks(bankValues)
    } catch (err: any) {
      toast.error("Failed to load banks")
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout(navigate)
  }

  // Helper function to normalize phone number to exactly 10 digits
  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '')
    
    // If it starts with 250 (country code), remove it
    if (digits.startsWith('250') && digits.length > 10) {
      digits = digits.substring(3)
    }
    
    // Ensure it's exactly 10 digits, if less than 10, pad with leading 0
    if (digits.length < 10) {
      digits = digits.padStart(10, '0')
    } else if (digits.length > 10) {
      // If more than 10, take the last 10 digits
      digits = digits.substring(digits.length - 10)
    }
    
    return digits
  }

  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.directorNames || !newSchool.email || !newSchool.phone || !newSchool.address || !newSchool.student || !newSchool.districtId || !newSchool.bankAccount) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate and normalize phone number
    const normalizedPhone = normalizePhoneNumber(newSchool.phone)
    if (normalizedPhone.length !== 10 || !/^\d{10}$/.test(normalizedPhone)) {
      toast.error("Phone number must be exactly 10 digits (e.g., 0785061721)")
      return
    }

    try {
      setIsProcessing(true)
      const schoolPayload: any = {
        name: newSchool.name,
        directorNames: newSchool.directorNames,
        email: newSchool.email,
        phone: normalizedPhone, // Use normalized phone number
        address: newSchool.address,
        student: Number(newSchool.student),
        bankAccount: newSchool.bankAccount,
        status: newSchool.status,
        district: { id: newSchool.districtId },
      }

      // Only include bank if it's selected
      if (newSchool.bank && newSchool.bank.trim() !== "") {
        schoolPayload.bank = newSchool.bank
      }

      await schoolService.registerSchool(schoolPayload)
      toast.success("School added successfully")
      setIsAddDialogOpen(false)
      setNewSchool({
        name: "",
        directorNames: "",
        email: "",
        phone: "",
        address: "",
        student: "",
        bank: "",
        bankAccount: "",
        status: true,
        province: "",
        districtId: "",
      })
      setAvailableDistricts([])
      fetchSchools()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) ||
                          err.message || 
                          "Failed to add school"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to add school")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school)
    setIsViewDialogOpen(true)
  }

  const handleEditSchool = async (school: School) => {
    setSelectedSchool(school)
    const province = school.district?.province || ""
    setNewSchool({
      name: school.name,
      directorNames: school.directorNames,
      email: school.email,
      phone: school.phone,
      address: school.address,
      student: String(school.student),
      bank: school.bank || "",
      bankAccount: school.bankAccount || "",
      status: school.status,
      province: province,
      districtId: school.district?.id || "",
    })
    // Fetch districts for the selected province when editing
    if (province) {
      await fetchDistrictsByProvince(province)
    }
    setIsEditDialogOpen(true)
  }

  const handleUpdateSchool = async () => {
    if (!selectedSchool || !newSchool.name || !newSchool.directorNames || !newSchool.email || !newSchool.phone || !newSchool.address || !newSchool.student || !newSchool.districtId || !newSchool.bankAccount) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate and normalize phone number
    const normalizedPhone = normalizePhoneNumber(newSchool.phone)
    if (normalizedPhone.length !== 10 || !/^\d{10}$/.test(normalizedPhone)) {
      toast.error("Phone number must be exactly 10 digits (e.g., 0785061721)")
      return
    }

    try {
      setIsProcessing(true)
      const schoolPayload: any = {
        name: newSchool.name,
        directorNames: newSchool.directorNames,
        email: newSchool.email,
        phone: normalizedPhone, // Use normalized phone number
        address: newSchool.address,
        student: Number(newSchool.student),
        bankAccount: newSchool.bankAccount,
        status: newSchool.status,
        district: { id: newSchool.districtId },
      }

      // Only include bank if it's selected
      if (newSchool.bank && newSchool.bank.trim() !== "") {
        schoolPayload.bank = newSchool.bank
      }

      await schoolService.updateSchool(selectedSchool.id, schoolPayload)
      toast.success("School updated successfully")
      setIsEditDialogOpen(false)
      setSelectedSchool(null)
      setNewSchool({
        name: "",
        directorNames: "",
        email: "",
        phone: "",
        address: "",
        student: "",
        bank: "",
        bankAccount: "",
        status: true,
        province: "",
        districtId: "",
      })
      setAvailableDistricts([])
      fetchSchools()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) ||
                          err.message || 
                          "Failed to update school"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to update school")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteSchool = async (schoolId: string) => {
    if (!window.confirm("Are you sure you want to delete this school?")) {
      return
    }

    try {
      setIsProcessing(true)
      await schoolService.deleteSchool(schoolId)
      toast.success("School deleted successfully")
      fetchSchools()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to delete school"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to delete school")
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredSchools = schools.filter(
    (school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.directorNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.district?.district.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDistrict = districtFilter === "all" || school.district?.id === districtFilter
      
      return matchesSearch && matchesDistrict
    }
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm, districtFilter])

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + pageSize)
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

  if (loading && schools.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-1 flex-col min-w-0">
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">School Management</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schools</CardTitle>
                <CardDescription>
                  Manage all schools in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search schools..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={districtFilter} onValueChange={setDistrictFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {allDistricts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add School
                        </Button>
                      </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New School</DialogTitle>
                    <DialogDescription>
                      Register a new school in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        className="col-span-3"
                        placeholder="School name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="director" className="text-right">
                        Director *
                      </Label>
                      <Input
                        id="director"
                        value={newSchool.directorNames}
                        onChange={(e) => setNewSchool({ ...newSchool, directorNames: e.target.value })}
                        className="col-span-3"
                        placeholder="Director full name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSchool.email}
                        onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                        className="col-span-3"
                        placeholder="school@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        value={newSchool.phone}
                        onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                        className="col-span-3"
                        placeholder="0785061721 (10 digits)"
                        maxLength={13}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        value={newSchool.address}
                        onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                        className="col-span-3"
                        placeholder="School address"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="students" className="text-right">
                        Students *
                      </Label>
                      <Input
                        id="students"
                        type="number"
                        value={newSchool.student}
                        onChange={(e) => setNewSchool({ ...newSchool, student: e.target.value })}
                        className="col-span-3"
                        placeholder="Number of students"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="province" className="text-right">
                        Province *
                      </Label>
                      <Select 
                        value={newSchool.province} 
                        onValueChange={(value) => {
                          setNewSchool({ ...newSchool, province: value, districtId: "" })
                        }}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select province" />
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="district" className="text-right">
                        District *
                      </Label>
                      <Select 
                        value={newSchool.districtId} 
                        onValueChange={(value) => setNewSchool({ ...newSchool, districtId: value })}
                        disabled={!newSchool.province}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={newSchool.province ? "Select district" : "Select province first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.district}
                            </SelectItem>
                          ))}
                          {availableDistricts.length === 0 && newSchool.province && (
                            <SelectItem value="new" disabled>
                              No districts found for this province.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bank" className="text-right">
                        Bank Name
                      </Label>
                      <Select 
                        value={newSchool.bank} 
                        onValueChange={(value) => setNewSchool({ ...newSchool, bank: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select bank" />
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bankAccount" className="text-right">
                        Bank Account *
                      </Label>
                      <Input
                        id="bankAccount"
                        value={newSchool.bankAccount}
                        onChange={(e) => setNewSchool({ ...newSchool, bankAccount: e.target.value })}
                        className="col-span-3"
                        placeholder="Bank account number"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select value={newSchool.status ? "true" : "false"} onValueChange={(value) => setNewSchool({ ...newSchool, status: value === "true" })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setNewSchool({
                          name: "",
                          directorNames: "",
                          email: "",
                          phone: "",
                          address: "",
                          student: "",
                          bank: "",
                          bankAccount: "",
                          status: true,
                          province: "",
                          districtId: "",
                        })
                        setAvailableDistricts([])
                      }}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSchool}
                      disabled={isProcessing || !newSchool.name || !newSchool.directorNames || !newSchool.email || !newSchool.phone || !newSchool.address || !newSchool.student || !newSchool.districtId || !newSchool.bankAccount}
                    >
                      {isProcessing ? "Adding..." : "Add School"}
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
                        <TableHead>School Name</TableHead>
                        <TableHead>Director</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSchools.length > 0 ? (
                        paginatedSchools.map((school) => (
                          <TableRow key={school.id}>
                            <TableCell className="font-medium">{school.name}</TableCell>
                            <TableCell>{school.directorNames}</TableCell>
                            <TableCell>{school.email}</TableCell>
                            <TableCell>{school.phone}</TableCell>
                            <TableCell>{school.district?.district || "N/A"}</TableCell>
                            <TableCell>{school.student}</TableCell>
                            <TableCell>
                              <Badge variant={school.status ? "default" : "secondary"}>
                                {school.status ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewSchool(school)}
                                  disabled={isProcessing}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditSchool(school)}
                                  disabled={isProcessing}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSchool(school.id)}
                                  disabled={isProcessing}
                                  title="Delete"
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
                            No schools found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-sm">
                      Showing {filteredSchools.length === 0 ? 0 : startIndex + 1}–
                      {Math.min(startIndex + pageSize, filteredSchools.length)} of {filteredSchools.length}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update school information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                className="col-span-3"
                placeholder="School name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-director" className="text-right">
                Director *
              </Label>
              <Input
                id="edit-director"
                value={newSchool.directorNames}
                onChange={(e) => setNewSchool({ ...newSchool, directorNames: e.target.value })}
                className="col-span-3"
                placeholder="Director full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={newSchool.email}
                onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                className="col-span-3"
                placeholder="school@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone *
              </Label>
              <Input
                id="edit-phone"
                value={newSchool.phone}
                onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                className="col-span-3"
                placeholder="0785061721 (10 digits)"
                maxLength={13}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address *
              </Label>
              <Input
                id="edit-address"
                value={newSchool.address}
                onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                className="col-span-3"
                placeholder="School address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-students" className="text-right">
                Students *
              </Label>
              <Input
                id="edit-students"
                type="number"
                value={newSchool.student}
                onChange={(e) => setNewSchool({ ...newSchool, student: e.target.value })}
                className="col-span-3"
                placeholder="Number of students"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-province" className="text-right">
                Province *
              </Label>
              <Select 
                value={newSchool.province} 
                onValueChange={(value) => {
                  setNewSchool({ ...newSchool, province: value, districtId: "" })
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select province" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-district" className="text-right">
                District *
              </Label>
              <Select 
                value={newSchool.districtId} 
                onValueChange={(value) => setNewSchool({ ...newSchool, districtId: value })}
                disabled={!newSchool.province}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={newSchool.province ? "Select district" : "Select province first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.district}
                    </SelectItem>
                  ))}
                  {availableDistricts.length === 0 && newSchool.province && (
                    <SelectItem value="new" disabled>
                      No districts found for this province.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bank" className="text-right">
                Bank Name
              </Label>
              <Select 
                value={newSchool.bank} 
                onValueChange={(value) => setNewSchool({ ...newSchool, bank: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select bank" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bankAccount" className="text-right">
                Bank Account *
              </Label>
              <Input
                id="edit-bankAccount"
                value={newSchool.bankAccount}
                onChange={(e) => setNewSchool({ ...newSchool, bankAccount: e.target.value })}
                className="col-span-3"
                placeholder="Bank account number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select value={newSchool.status ? "true" : "false"} onValueChange={(value) => setNewSchool({ ...newSchool, status: value === "true" })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedSchool(null)
                setNewSchool({
                  name: "",
                  directorNames: "",
                  email: "",
                  phone: "",
                  address: "",
                  student: "",
                  bank: "",
                  bankAccount: "",
                  status: true,
                  province: "",
                  districtId: "",
                })
                setAvailableDistricts([])
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSchool}
              disabled={isProcessing || !newSchool.name || !newSchool.directorNames || !newSchool.email || !newSchool.phone || !newSchool.address || !newSchool.student || !newSchool.districtId || !newSchool.bankAccount}
            >
              {isProcessing ? "Updating..." : "Update School"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
            <DialogDescription>
              View complete information about the school.
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Name</Label>
                <div className="col-span-3">{selectedSchool.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Director</Label>
                <div className="col-span-3">{selectedSchool.directorNames}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Email</Label>
                <div className="col-span-3">{selectedSchool.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Phone</Label>
                <div className="col-span-3">{selectedSchool.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Address</Label>
                <div className="col-span-3">{selectedSchool.address}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Students</Label>
                <div className="col-span-3">{selectedSchool.student}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Province</Label>
                <div className="col-span-3">{selectedSchool.district?.province || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">District</Label>
                <div className="col-span-3">{selectedSchool.district?.district || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Bank Name</Label>
                <div className="col-span-3">{selectedSchool.bank || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Bank Account</Label>
                <div className="col-span-3">{selectedSchool.bankAccount}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Status</Label>
                <div className="col-span-3">
                  <Badge variant={selectedSchool.status ? "default" : "secondary"}>
                    {selectedSchool.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false)
                setSelectedSchool(null)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GovSchools

