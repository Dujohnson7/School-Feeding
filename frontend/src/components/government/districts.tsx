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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"

interface District {
  id: string
  province: string
  district: string
  active: boolean
  created?: string
  updated?: string
}



export function GovDistricts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [districts, setDistricts] = useState<District[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

  const [newDistrict, setNewDistrict] = useState({
    province: "",
    district: "",
    active: true,
  })

  useEffect(() => {
    fetchDistricts()
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (newDistrict.province) {
      fetchDistrictsByProvince(newDistrict.province)
    } else {
      setAvailableDistricts([])
    }
  }, [newDistrict.province])

  const fetchDistricts = async () => {
    try {
      setLoading(true)
      const data = await governmentService.getAllDistricts()
      setDistricts(data || [])
    } catch (err: any) {
      console.error("Error fetching districts:", err)
      toast.error("Failed to load districts")
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    try {
      const data = await governmentService.getProvinces()
      setProvinces(data || [])
    } catch (err: any) {
      console.error("Error fetching provinces:", err)
      toast.error("Failed to load provinces")
    }
  }

  const fetchDistrictsByProvince = async (province: string) => {
    try {
      const data = await governmentService.getDistrictsByProvince(province)
      // API returns List<EDistrict> (enum values), extract the string values
      const districtValues = Array.isArray(data) ? data.map((d: any) => typeof d === 'string' ? d : d.toString()) : []
      setAvailableDistricts(districtValues)
    } catch (err: any) {
      console.error("Error fetching districts by province:", err)
      setAvailableDistricts([])
    }
  }



  const handleAddDistrict = async () => {
    if (!newDistrict.province || !newDistrict.district) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const districtPayload = {
        province: newDistrict.province,
        district: newDistrict.district,
        active: newDistrict.active,
      }

      await governmentService.registerDistrict(districtPayload)
      toast.success("District added successfully")
      setIsAddDialogOpen(false)
      setNewDistrict({
        province: "",
        district: "",
        active: true,
      })
      setAvailableDistricts([])
      fetchDistricts()
    } catch (err: any) {
      console.error("Error adding district:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to add district"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to add district")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditDistrict = async (district: District) => {
    setSelectedDistrict(district)
    setNewDistrict({
      province: district.province,
      district: district.district,
      active: district.active,
    })
    // Fetch districts for the selected province when editing
    if (district.province) {
      await fetchDistrictsByProvince(district.province)
    }
    setIsEditDialogOpen(true)
  }

  const handleUpdateDistrict = async () => {
    if (!selectedDistrict || !newDistrict.province || !newDistrict.district) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsProcessing(true)
      const districtPayload = {
        province: newDistrict.province,
        district: newDistrict.district,
        active: newDistrict.active,
      }

      await governmentService.updateDistrict(selectedDistrict.id, districtPayload)
      toast.success("District updated successfully")
      setIsEditDialogOpen(false)
      setSelectedDistrict(null)
      setNewDistrict({
        province: "",
        district: "",
        active: true,
      })
      fetchDistricts()
    } catch (err: any) {
      console.error("Error updating district:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to update district"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to update district")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteDistrict = async (districtId: string) => {
    if (!window.confirm("Are you sure you want to delete this district?")) {
      return
    }

    try {
      setIsProcessing(true)
      await governmentService.deleteDistrict(districtId)
      toast.success("District deleted successfully")
      fetchDistricts()
    } catch (err: any) {
      console.error("Error deleting district:", err)
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to delete district"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to delete district")
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredDistricts = districts.filter(
    (district) =>
      district.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.province.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredDistricts.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedDistricts = filteredDistricts.slice(startIndex, startIndex + pageSize)
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

  if (loading && districts.length === 0) {
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
            <h1 className="text-lg font-semibold">District Management</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Districts</CardTitle>
                <CardDescription>
                  Manage all districts in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search districts..."
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
                          Add District
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New District</DialogTitle>
                          <DialogDescription>
                            Register a new district in the system.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="province" className="text-right">
                              Province *
                            </Label>
                            <Select
                              value={newDistrict.province}
                              onValueChange={(value) => {
                                setNewDistrict({ ...newDistrict, province: value, district: "" })
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
                              value={newDistrict.district}
                              onValueChange={(value) => setNewDistrict({ ...newDistrict, district: value })}
                              disabled={!newDistrict.province}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={newDistrict.province ? "Select district" : "Select province first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDistricts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                                {availableDistricts.length === 0 && newDistrict.province && (
                                  <SelectItem value="new" disabled>
                                    No districts found. You can create a new one.
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="active" className="text-right">
                              Status
                            </Label>
                            <Select value={newDistrict.active ? "true" : "false"} onValueChange={(value) => setNewDistrict({ ...newDistrict, active: value === "true" })}>
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
                              setNewDistrict({
                                province: "",
                                district: "",
                                active: true,
                              })
                              setAvailableDistricts([])
                            }}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddDistrict}
                            disabled={isProcessing || !newDistrict.province || !newDistrict.district}
                          >
                            {isProcessing ? "Adding..." : "Add District"}
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
                        <TableHead>District</TableHead>
                        <TableHead>Province</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDistricts.length > 0 ? (
                        paginatedDistricts.map((district) => (
                          <TableRow key={district.id}>
                            <TableCell className="font-medium">{district.district}</TableCell>
                            <TableCell>{district.province}</TableCell>
                            <TableCell>
                              <Badge variant={district.active ? "default" : "secondary"}>
                                {district.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {district.created ? new Date(district.created).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditDistrict(district)}
                                  disabled={isProcessing}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteDistrict(district.id)}
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
                          <TableCell colSpan={5} className="h-24 text-center">
                            No districts found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-sm">
                      Showing {filteredDistricts.length === 0 ? 0 : startIndex + 1}–
                      {Math.min(startIndex + pageSize, filteredDistricts.length)} of {filteredDistricts.length}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit District</DialogTitle>
            <DialogDescription>
              Update district information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-province" className="text-right">
                Province *
              </Label>
              <Select
                value={newDistrict.province}
                onValueChange={(value) => {
                  setNewDistrict({ ...newDistrict, province: value, district: "" })
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
                value={newDistrict.district}
                onValueChange={(value) => setNewDistrict({ ...newDistrict, district: value })}
                disabled={!newDistrict.province}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={newDistrict.province ? "Select district" : "Select province first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                  {availableDistricts.length === 0 && newDistrict.province && (
                    <SelectItem value="new" disabled>
                      No districts found. You can update to a new one.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-active" className="text-right">
                Status
              </Label>
              <Select value={newDistrict.active ? "true" : "false"} onValueChange={(value) => setNewDistrict({ ...newDistrict, active: value === "true" })}>
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
                setSelectedDistrict(null)
                setNewDistrict({
                  province: "",
                  district: "",
                  active: true,
                })
                setAvailableDistricts([])
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDistrict}
              disabled={isProcessing || !newDistrict.province || !newDistrict.district}
            >
              {isProcessing ? "Updating..." : "Update District"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GovDistricts

