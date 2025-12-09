import { useState, useEffect } from "react"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import apiClient from "@/lib/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,} from "@/components/ui/alert-dialog"
 
interface ApiRequestItem {
  id: string
  requestStatus: string
  requestItemDetails: Array<{
    id: string
    item: { id: string }
    quantity: number
  }>
  description: string
  created: string
  updated?: string
}

interface Item {
  id: string
  name: string
  category?: string
  unit?: string
}
 
interface FoodRequest {
  id: string
  items: Array<{ name: string; quantity: number }>
  status: string
  requestedDate: string
  description: string
}

export function RequestFoodList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [requests, setRequests] = useState<FoodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<FoodRequest | null>(null)
  const [editFormState, setEditFormState] = useState({
    foodItems: [] as string[],
    quantities: {} as Record<string, string>,
    notes: "",
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiClient.get("/item/all")
        setItems(response.data)
      } catch (err) {
        console.error("Error fetching items:", err)
      }
    }
    fetchItems()
  }, [])
 
  useEffect(() => {
    const fetchRequests = async () => {
      const schoolId = localStorage.getItem("schoolId")

      if (!schoolId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiClient.get(
          `/requestRequestItem/schoolRequest/${schoolId}`
        )

        const data: ApiRequestItem[] = response.data
 
        const transformedRequests: FoodRequest[] = data.map((request) => {
          const requestItems = request.requestItemDetails.map((detail) => {
            const item = items.find((i) => i.id === detail.item.id)
            return {
              name: item?.name || `Item ${detail.item.id.substring(0, 8)}`,
              quantity: detail.quantity,
            }
          })

          return {
            id: request.id,
            items: requestItems,
            status: request.requestStatus,
            requestedDate: request.created,
            description: request.description,
          }
        })

        setRequests(transformedRequests)
      } catch (err) {
        console.error("Error fetching requests:", err)
        toast.error("Failed to load food requests. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    if (items.length > 0) {
      fetchRequests()
    }
  }, [items])
 
  const getItemIdByName = (name: string): string | null => {
    const normalizedName = name.toLowerCase().trim()
    const item = items.find((i) => i.name.toLowerCase().trim() === normalizedName)
    return item?.id || null
  }
 
  const handleEdit = (request: FoodRequest) => {
    setSelectedRequest(request)
    setEditError(null)
     
    const foodItems = request.items.map((item) => item.name)
    const quantities: Record<string, string> = {}
    request.items.forEach((item) => {
      quantities[item.name] = item.quantity.toString()
    })

    setEditFormState({
      foodItems,
      quantities,
      notes: request.description,
    })
    setEditDialogOpen(true)
  }
 
  const handleAddFoodItem = (item: string) => {
    if (item && !editFormState.foodItems.includes(item)) {
      setEditFormState({
        ...editFormState,
        foodItems: [...editFormState.foodItems, item],
        quantities: { ...editFormState.quantities, [item]: "" },
      })
    }
  }
 
  const handleRemoveFoodItem = (item: string) => {
    const newFoodItems = editFormState.foodItems.filter((i) => i !== item)
    const newQuantities = { ...editFormState.quantities }
    delete newQuantities[item]

    setEditFormState({
      ...editFormState,
      foodItems: newFoodItems,
      quantities: newQuantities,
    })
  }
 
  const handleQuantityChange = (item: string, quantity: string) => {
    setEditFormState({
      ...editFormState,
      quantities: { ...editFormState.quantities, [item]: quantity },
    })
  }
 
  const handleUpdateRequest = async () => {
    if (!selectedRequest) return

    setEditError(null)
 
    const missingQuantities = editFormState.foodItems.filter(
      (item) => !editFormState.quantities[item] || editFormState.quantities[item].trim() === ""
    )

    if (missingQuantities.length > 0) {
      setEditError("Please enter quantities for all selected items.")
      return
    }
 
    const invalidQuantities = editFormState.foodItems.filter((item) => {
      const qty = parseFloat(editFormState.quantities[item])
      return isNaN(qty) || qty <= 0
    })

    if (invalidQuantities.length > 0) {
      setEditError("Please enter valid positive quantities for all items.")
      return
    }

    const districtId = localStorage.getItem("districtId")
    const schoolId = localStorage.getItem("schoolId")
    const token = localStorage.getItem("token")

    if (!districtId || !schoolId || !token) {
      setEditError("Authentication required. Please log in again.")
      return
    }
 
    const requestItemDetails = editFormState.foodItems
      .map((itemName) => {
        const itemId = getItemIdByName(itemName)
        if (!itemId) {
          return null
        }
        return {
          item: { id: itemId },
          quantity: parseFloat(editFormState.quantities[itemName]),
        }
      })
      .filter((detail): detail is { item: { id: string }; quantity: number } => detail !== null)

    if (requestItemDetails.length === 0) {
      setEditError("Could not find item IDs for the selected items. Please try again.")
      return
    }
 
    const requestPayload = {
      district: { id: districtId },
      school: { id: schoolId },
      requestItemDetails,
      description: editFormState.notes || "Food request from school",
    }

    setEditLoading(true)

    try {
      const response = await apiClient.put(
        `/requestRequestItem/update/${selectedRequest.id}`,
        requestPayload
      )
      const data = response.data

      toast.success("Food request updated successfully.")
 
      if (schoolId && token) {
        const refreshResponse = await fetch(
          `http://localhost:8070/api/requestRequestItem/schoolRequest/${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (refreshResponse.ok) {
          const refreshData: ApiRequestItem[] = await refreshResponse.json()
          const transformedRequests: FoodRequest[] = refreshData.map((request) => {
            const requestItems = request.requestItemDetails.map((detail) => {
              const item = items.find((i) => i.id === detail.item.id)
              return {
                name: item?.name || `Item ${detail.item.id.substring(0, 8)}`,
                quantity: detail.quantity,
              }
            })
            return {
              id: request.id,
              items: requestItems,
              status: request.requestStatus,
              requestedDate: request.created,
              description: request.description,
            }
          })
          setRequests(transformedRequests)
        }
      }

      setEditDialogOpen(false)
      setSelectedRequest(null)
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to update request. Please try again."
      setEditError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setEditLoading(false)
    }
  }

  
  const handleDeleteRequest = async () => {
    if (!selectedRequest) return

    try {
      await apiClient.delete(
        `/requestRequestItem/delete/${selectedRequest.id}`
      )

      toast.success("Food request deleted successfully.")

     
      setRequests(requests.filter((r) => r.id !== selectedRequest.id))
      setDeleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete request. Please try again.")
    }
  }

  const filteredRequests = requests.filter((request) => {
    const itemsText = request.items.map((i) => i.name).join(" ")
    const matchesSearch =
      itemsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || request.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + pageSize)

  const getStatusVariant = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "pending":
        return "outline"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "completed":
        return "secondary"
      case "fulfilled":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "fulfilled":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <h1 className="text-lg font-semibold">Food Requests</h1>
          <div className="ml-auto"></div>
        </header>

        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="space-y-6">
            {/* Food Requests Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Food Requests</CardTitle>
                  <CardDescription>View and manage all food requests from your school.</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search requests..."
                        className="w-[180px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button asChild>
                    <Link to="/request-food" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Request
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Loading requests...</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Food Items</TableHead>
                            <TableHead className="text-right">Total Quantity (kg)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.length > 0 ? (
                            paginatedRequests.map((request) => {
                              const totalQuantity = request.items.reduce((sum, item) => sum + item.quantity, 0)
                              const isPending = request.status.toUpperCase() === "PENDING"
                              return (
                                <TableRow key={request.id}>
                                  <TableCell className="font-medium">{request.id.substring(0, 8)}...</TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      {request.items.map((item, idx) => (
                                        <div key={idx} className="text-sm">
                                          {item.name}: {item.quantity} kg
                                        </div>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">{totalQuantity.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={getStatusVariant(request.status)}
                                      className={getStatusColor(request.status)}
                                    >
                                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(request.requestedDate).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {isPending ? (
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEdit(request)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedRequest(request)
                                            setDeleteDialogOpen(true)
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                {searchTerm ? "No matching requests found." : "No food requests yet."}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-sm">
                          {filteredRequests.length === 0
                            ? 0
                            : `${startIndex + 1}–${Math.min(startIndex + pageSize, filteredRequests.length)}`}{" "}
                          of {filteredRequests.length} requests
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
                            <SelectItem value="8">8 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Pagination className="sm:justify-end">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (page > 1) setPage(page - 1)
                              }}
                              className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (page <= 3) {
                              pageNum = i + 1
                            } else if (page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = page - 2 + i
                            }

                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setPage(pageNum)
                                  }}
                                  isActive={page === pageNum}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (page < totalPages) setPage(page + 1)
                              }}
                              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food Request</DialogTitle>
            <DialogDescription>Update the food items and quantities for this request.</DialogDescription>
          </DialogHeader>

          {editError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{editError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Food Items</Label>
              <Select onValueChange={handleAddFoodItem} disabled={items.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.name}
                      disabled={editFormState.foodItems.includes(item.name)}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editFormState.foodItems.length > 0 && (
              <div className="rounded-md border p-4 space-y-3">
                <h3 className="text-sm font-medium">Selected Items</h3>
                {editFormState.foodItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1/3">
                      <span className="text-sm">{item}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity (kg)"
                        value={editFormState.quantities[item]}
                        onChange={(e) => handleQuantityChange(item, e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFoodItem(item)}
                        disabled={editLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or requirements"
                value={editFormState.notes}
                onChange={(e) =>
                  setEditFormState({ ...editFormState, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequest} disabled={editLoading || editFormState.foodItems.length === 0}>
              {editLoading ? "Updating..." : "Update Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the food request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRequest(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
