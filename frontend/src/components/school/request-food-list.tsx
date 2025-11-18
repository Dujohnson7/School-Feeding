import { useState } from "react"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Define the type for a food request
interface FoodRequest {
  id: string
  foodItem: string
  quantity: number
  status: "pending" | "approved" | "rejected" | "fulfilled"
  requestedDate: string
  deliveryDate?: string
}

export function RequestFoodList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Sample data - in a real app, this would come from an API
  const [requests, setRequests] = useState<FoodRequest[]>([
    {
      id: "REQ-001",
      foodItem: "Rice",
      quantity: 50,
      status: "pending",
      requestedDate: "2025-11-15",
    },
    {
      id: "REQ-002",
      foodItem: "Beans",
      quantity: 30,
      status: "approved",
      requestedDate: "2025-11-10",
      deliveryDate: "2025-11-20",
    },
    {
      id: "REQ-003",
      foodItem: "Cooking Oil",
      quantity: 20,
      status: "fulfilled",
      requestedDate: "2025-11-05",
      deliveryDate: "2025-11-12",
    },
  ])

  // Filter requests based on search term and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === "all" || 
      request.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + pageSize)

  // Function to handle new food request submission
  const handleNewRequest = (newRequest: FoodRequest) => {
    setRequests([newRequest, ...requests])
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "outline"
      case "rejected":
        return "destructive"
      case "fulfilled":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1">
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <h1 className="text-lg font-semibold">Food Requests</h1>
          <div className="ml-auto"> 
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
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
                    <Select 
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Food Item</TableHead>
                        <TableHead className="text-right">Quantity (kg)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested Date</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length > 0 ? (
                        paginatedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <Link to={`/request-food/${request.id}`} className="hover:underline">
                                {request.id}
                              </Link>
                            </TableCell>
                            <TableCell>{request.foodItem}</TableCell>
                            <TableCell className="text-right">{request.quantity}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {request.deliveryDate
                                ? new Date(request.deliveryDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/request-food/${request.id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this request?')) {
                                      setRequests(requests.filter(r => r.id !== request.id));
                                    }
                                  }}
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
                            {searchTerm ? 'No matching requests found.' : 'No food requests yet.'}
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
                      {filteredRequests.length === 0 ? 0 : startIndex + 1}–
                      {Math.min(startIndex + pageSize, filteredRequests.length)} of {filteredRequests.length} requests
                    </span>
                    <Select 
                      value={String(pageSize)} 
                      onValueChange={(v) => { 
                        setPageSize(Number(v)); 
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Rows" />
                      </SelectTrigger>
                      <SelectContent>
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
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show page numbers with ellipsis
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                              }}
                              isActive={page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
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
