
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Home,
  LogOut,
  Package,
  Settings,
  User,
  FileText,
  BarChart3,
  Users,
  DollarSign,
  Upload,
  Download,
  Plus,
  Search,
  TrendingUp,
  AlertCircle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function GovBudget() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false)
  const [pageAlloc, setPageAlloc] = useState(1)
  const [pageSizeAlloc, setPageSizeAlloc] = useState(5)
  const [pageHist, setPageHist] = useState(1)
  const [pageSizeHist, setPageSizeHist] = useState(5)

  // Mock budget data
  const budgetOverview = {
    totalBudget: 45000000000, // 45 billion RWF
    allocated: 38000000000, // 38 billion RWF
    spent: 28500000000, // 28.5 billion RWF
    remaining: 16500000000, // 16.5 billion RWF
  }

  const districtAllocations = [
    { id: 1, district: "Kigali", allocated: 8500000000, spent: 6200000000, schools: 156, status: "On Track" },
    { id: 2, district: "Nyarugenge", allocated: 3200000000, spent: 2800000000, schools: 89, status: "On Track" },
    { id: 3, district: "Gasabo", allocated: 4100000000, spent: 3100000000, schools: 124, status: "On Track" },
    { id: 4, district: "Kicukiro", allocated: 2800000000, spent: 2300000000, schools: 67, status: "On Track" },
    { id: 5, district: "Nyanza", allocated: 2100000000, spent: 1900000000, schools: 78, status: "At Risk" },
    { id: 6, district: "Huye", allocated: 1900000000, spent: 1600000000, schools: 65, status: "On Track" },
    { id: 7, district: "Musanze", allocated: 2200000000, spent: 1800000000, schools: 82, status: "On Track" },
    { id: 8, district: "Rubavu", allocated: 1800000000, spent: 1500000000, schools: 71, status: "On Track" },
  ]

  const budgetHistory = [
    { id: 1, year: "2025", amount: 45000000000, status: "Active", imported: "2024-12-15", by: "Minister of Education" },
    {
      id: 2,
      year: "2024",
      amount: 42000000000,
      status: "Completed",
      imported: "2023-12-10",
      by: "Minister of Education",
    },
    {
      id: 3,
      year: "2023",
      amount: 38000000000,
      status: "Completed",
      imported: "2022-12-08",
      by: "Minister of Education",
    },
    {
      id: 4,
      year: "2022",
      amount: 35000000000,
      status: "Completed",
      imported: "2021-12-12",
      by: "Minister of Education",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleImportBudget = () => {
    toast({
      title: "Budget Imported Successfully",
      description: "The budget file has been processed and imported into the system.",
    })
    setIsImportDialogOpen(false)
  }

  const handleAllocateBudget = () => {
    toast({
      title: "Budget Allocated Successfully",
      description: "Budget has been allocated to the selected district.",
    })
    setIsAllocateDialogOpen(false)
  }

  const filteredDistricts = districtAllocations.filter(
    (district) =>
      district.district.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDistrict === "all" || district.district === selectedDistrict),
  )

  useEffect(() => {
    setPageAlloc(1)
  }, [searchTerm, selectedDistrict])

  const totalPagesAlloc = Math.max(1, Math.ceil(filteredDistricts.length / pageSizeAlloc))
  const startAlloc = (pageAlloc - 1) * pageSizeAlloc
  const paginatedDistricts = filteredDistricts.slice(startAlloc, startAlloc + pageSizeAlloc)
  const canPrevAlloc = pageAlloc > 1
  const canNextAlloc = pageAlloc < totalPagesAlloc
  const getAllocPageWindow = () => {
    const maxButtons = 5
    if (totalPagesAlloc <= maxButtons) return Array.from({ length: totalPagesAlloc }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, pageAlloc - half)
    let end = Math.min(totalPagesAlloc, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const totalPagesHist = Math.max(1, Math.ceil(budgetHistory.length / pageSizeHist))
  const startHist = (pageHist - 1) * pageSizeHist
  const paginatedHistory = budgetHistory.slice(startHist, startHist + pageSizeHist)
  const canPrevHist = pageHist > 1
  const canNextHist = pageHist < totalPagesHist
  const getHistPageWindow = () => {
    const maxButtons = 5
    if (totalPagesHist <= maxButtons) return Array.from({ length: totalPagesHist }, (_, i) => i + 1)
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, pageHist - half)
    let end = Math.min(totalPagesHist, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <Package className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Budget Management</h1>
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
                    <AvatarFallback>GO</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Government Official</p>
                    <p className="text-xs leading-none text-muted-foreground">gov@mineduc.gov.rw</p>
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
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          {/* Budget Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(budgetOverview.totalBudget)}</div>
                <p className="text-xs text-muted-foreground">FY 2025</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allocated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(budgetOverview.allocated)}</div>
                <p className="text-xs text-muted-foreground">84.4% of total budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(budgetOverview.spent)}</div>
                <p className="text-xs text-muted-foreground">63.3% of total budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(budgetOverview.remaining)}</div>
                <p className="text-xs text-muted-foreground">36.7% remaining</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="allocations" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="allocations">District Allocations</TabsTrigger>
                <TabsTrigger value="history">Budget History</TabsTrigger>
                <TabsTrigger value="import">Import Budget</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Allocate Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Allocate Budget to District</DialogTitle>
                      <DialogDescription>
                        Allocate budget funds to a specific district for school feeding programs.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="district" className="text-right">
                          District
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kigali">Kigali</SelectItem>
                            <SelectItem value="nyarugenge">Nyarugenge</SelectItem>
                            <SelectItem value="gasabo">Gasabo</SelectItem>
                            <SelectItem value="kicukiro">Kicukiro</SelectItem>
                            <SelectItem value="nyanza">Nyanza</SelectItem>
                            <SelectItem value="huye">Huye</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount (RWF)
                        </Label>
                        <Input id="amount" placeholder="Enter amount" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purpose" className="text-right">
                          Purpose
                        </Label>
                        <Textarea
                          id="purpose"
                          placeholder="Describe the purpose of this allocation"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAllocateBudget}>
                        Allocate Budget
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
                                                          
            <TabsContent value="allocations" className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search districts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    <SelectItem value="Kigali">Kigali</SelectItem>
                    <SelectItem value="Nyarugenge">Nyarugenge</SelectItem>
                    <SelectItem value="Gasabo">Gasabo</SelectItem>
                    <SelectItem value="Kicukiro">Kicukiro</SelectItem>
                    <SelectItem value="Nyanza">Nyanza</SelectItem>
                    <SelectItem value="Huye">Huye</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* District Allocations Table */}
              <Card>
                <CardHeader>
                  <CardTitle>District Budget Allocations</CardTitle>
                  <CardDescription>Budget allocation and spending by district for FY 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDistricts.length > 0 ? paginatedDistricts.map((district) => (
                      <div key={district.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{district.district}</h3>
                            <Badge variant={district.status === "On Track" ? "default" : "destructive"}>
                              {district.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{district.schools} schools</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Allocated: {formatCurrency(district.allocated)}</span>
                            <span>Spent: {formatCurrency(district.spent)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">
                            {((district.spent / district.allocated) * 100).toFixed(1)}% utilized
                          </div>
                          <Progress value={(district.spent / district.allocated) * 100} className="w-[100px]" />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">No districts found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {filteredDistricts.length === 0 ? 0 : startAlloc + 1}–
                    {Math.min(startAlloc + pageSizeAlloc, filteredDistricts.length)} of {filteredDistricts.length}
                  </span>
                  <Select value={String(pageSizeAlloc)} onValueChange={(v) => { setPageSizeAlloc(Number(v)); setPageAlloc(1) }}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => { e.preventDefault(); if (canPrevAlloc) setPageAlloc((p) => p - 1) }}
                        className={!canPrevAlloc ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getAllocPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === pageAlloc}
                          onClick={(e) => { e.preventDefault(); setPageAlloc(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNextAlloc) setPageAlloc((p) => p + 1) }}
                        className={!canNextAlloc ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Budget History</CardTitle>
                  <CardDescription>Historical budget imports and allocations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetHistory.length > 0 ? paginatedHistory.map((budget) => (
                      <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">FY {budget.year}</h3>
                            <Badge variant={budget.status === "Active" ? "default" : "secondary"}>
                              {budget.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Imported on {budget.imported} by {budget.by}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(budget.amount)}</div>
                          <div className="text-sm text-muted-foreground">Total Budget</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">No history found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">
                    Showing {budgetHistory.length === 0 ? 0 : startHist + 1}–
                    {Math.min(startHist + pageSizeHist, budgetHistory.length)} of {budgetHistory.length}
                  </span>
                  <Select value={String(pageSizeHist)} onValueChange={(v) => { setPageSizeHist(Number(v)); setPageHist(1) }}>
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
                        onClick={(e) => { e.preventDefault(); if (canPrevHist) setPageHist((p) => p - 1) }}
                        className={!canPrevHist ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>

                    {getHistPageWindow().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === pageHist}
                          onClick={(e) => { e.preventDefault(); setPageHist(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (canNextHist) setPageHist((p) => p + 1) }}
                        className={!canNextHist ? "pointer-events-none opacity-50" : ""}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Import Budget</CardTitle>
                  <CardDescription>Import budget data from Excel or CSV files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fiscal-year">Fiscal Year</Label> 
                        <Input type="number" placeholder="Enter Fiscal Year. eg:2025" id="fiscal-year" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget-type">Budget Amount</Label> 
                        <Input type="number" placeholder="Enter Budget Amount in Rwf" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget-file">Budget File</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <div className="mt-4">
                          <Button variant="outline">Choose File</Button>
                          <p className="mt-2 text-sm text-muted-foreground">Upload Excel (.xlsx) or CSV (.csv) files</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter a description for this budget import" rows={3} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={handleImportBudget}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Budget
                      </Button> 
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
