
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Home,
  Package,
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
import { HeaderActions } from "@/components/shared/header-actions"
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
import { toast } from "sonner"
import { budgetService, BudgetGov, EFiscalState, BudgetDistrict } from "./service/budgetService"
import { governmentService } from "./service/governmentService"

export function GovBudget() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("all")
  const [selectedAllocationBudgetId, setSelectedAllocationBudgetId] = useState<string>("")
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false)
  const [pageAlloc, setPageAlloc] = useState(1)
  const [pageSizeAlloc, setPageSizeAlloc] = useState(5)

  const [budgets, setBudgets] = useState<BudgetGov[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [districtAllocations, setDistrictAllocations] = useState<BudgetDistrict[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Registration State
  const [regFiscalYear, setRegFiscalYear] = useState("")
  const [regAmount, setRegAmount] = useState("")
  const [regStatus, setRegStatus] = useState<EFiscalState>(EFiscalState.INACTIVE)
  const [regDescription, setRegDescription] = useState("")

  useEffect(() => {
    fetchBudgets()
    fetchDistricts()
    fetchDistrictAllocations()
  }, [])

  const fetchDistrictAllocations = async () => {
    try {
      const data = await budgetService.getGovDistrictAllocations()
      setDistrictAllocations(data)
    } catch (error) {
      console.error("Error fetching district allocations:", error)
    }
  }

  const fetchBudgets = async () => {
    try {
      setIsLoading(true)
      const data = await budgetService.getAllBudgetGov()
      setBudgets(data)
    } catch (error) {
      console.error("Error fetching budgets:", error)
      toast.error("Failed to load budgets")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDistricts = async () => {
    try {
      const data = await governmentService.getAllDistricts()
      setDistricts(data)
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate overview totals based on active budget
  const activeBudget = budgets.find(b => b.fiscalState === EFiscalState.ACTIVE)
  const totalBudgetAmount = activeBudget?.budget || 0
  const activeYear = activeBudget?.fiscalYear || "N/A"

  const handleImportBudget = async () => {
    if (!regFiscalYear || !regAmount) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      await budgetService.registerBudgetGov({
        fiscalYear: regFiscalYear,
        budget: Number(regAmount),
        fiscalState: regStatus,
        description: regDescription
      })
      toast.success("Budget Registered Successfully")
      fetchBudgets()
      // Reset form
      setRegFiscalYear("")
      setRegAmount("")
      setRegDescription("")
    } catch (error) {
      console.error("Error registering budget:", error)
      toast.error("Failed to register budget")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAllocateBudget = async () => {
    if (!selectedAllocationBudgetId) {
      toast.error("Please select a fiscal year to allocate")
      return
    }

    try {
      setIsLoading(true)
      await budgetService.allocateBudget(selectedAllocationBudgetId)
      toast.success("Budget Allocated Successfully")
      fetchBudgets() // Refresh to see updated states
      fetchDistrictAllocations()
      setIsAllocateDialogOpen(false)
      setSelectedAllocationBudgetId("")
    } catch (error) {
      console.error("Error allocating budget:", error)
      toast.error("Failed to allocate budget")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDistricts = districtAllocations.filter(
    (d) =>
      d.district?.district?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDistrict === "all" || d.district?.district === selectedDistrict) &&
      (selectedFiscalYear === "all" || d.budgetGov?.fiscalYear === selectedFiscalYear),
  )

  useEffect(() => {
    setPageAlloc(1)
  }, [searchTerm, selectedDistrict, selectedFiscalYear])

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

  const totalAllocated = districtAllocations.reduce((acc, curr) => acc + curr.budget, 0)
  const totalSpent = districtAllocations.reduce((acc, curr) => acc + curr.spentBudget, 0)
  const remainingBudget = totalBudgetAmount - totalAllocated

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
          <HeaderActions role="government" />
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
                <div className="text-2xl font-bold">{formatCurrency(totalBudgetAmount)}</div>
                <p className="text-xs text-muted-foreground">FY {activeYear}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allocated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAllocated)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalBudgetAmount > 0 ? ((totalAllocated / totalBudgetAmount) * 100).toFixed(1) : 0}% of total budget
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalBudgetAmount > 0 ? ((totalSpent / totalBudgetAmount) * 100).toFixed(1) : 0}% of total budget
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(remainingBudget)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalBudgetAmount > 0 ? ((remainingBudget / totalBudgetAmount) * 100).toFixed(1) : 0}% remaining
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="allocations" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="allocations">District Allocations</TabsTrigger>
                <TabsTrigger value="history">Budget Fiscal Year</TabsTrigger>
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
                      <DialogTitle>Allocate Budget</DialogTitle>
                      <DialogDescription>
                        Select an inactive fiscal year to trigger its distribution across districts.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fiscalYear" className="text-right">
                          Fiscal Year
                        </Label>
                        <Select value={selectedAllocationBudgetId} onValueChange={setSelectedAllocationBudgetId}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select inactive budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgets
                              .filter(b => b.fiscalState === EFiscalState.INACTIVE)
                              .map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  FY {b.fiscalYear} ({formatCurrency(b.budget)})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAllocateBudget} disabled={isLoading}>
                        {isLoading ? "Allocating..." : "Allocate Budget"}
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
                    {/* Display districts from the state populated by the database */}
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.district}>{d.district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Fiscal Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fiscal Years</SelectItem>
                    {/* Unique fiscal years from budgets list */}
                    {Array.from(new Set(budgets.map(b => b.fiscalYear))).map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Allocations Table */}
              <Card>
                <CardHeader>
                  <CardTitle>District Budget Allocations</CardTitle>
                  <CardDescription>Budget allocation and spending by districts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDistricts.length > 0 ? paginatedDistricts.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{d.district?.district}</h3>
                            <Badge variant="outline" className="bg-primary/5">
                              FY {d.budgetGov?.fiscalYear}
                            </Badge>
                            <Badge variant="outline">
                              {d.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Province: {d.district?.province}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Allocated: {formatCurrency(d.budget)}</span>
                            <span>Spent: {formatCurrency(d.spentBudget)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">
                            {d.budget > 0 ? ((d.spentBudget / d.budget) * 100).toFixed(1) : 0}% utilized
                          </div>
                          <Progress value={d.budget > 0 ? (d.spentBudget / d.budget) * 100 : 0} className="w-[100px]" />
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
                  <CardTitle>Budget Fiscal Year</CardTitle>
                  <CardDescription>Budget allocations distributed to districts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.length > 0 ? budgets.map((budget) => (
                      <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">FY {budget.fiscalYear}</h3>
                            <Badge variant={budget.fiscalState === EFiscalState.ACTIVE ? "default" : "secondary"}>
                              {budget.fiscalState}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {budget.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(budget.budget)}</div>
                          <div className="text-sm text-muted-foreground">Total Budget</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading budgets..." : "No history found."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
                        <Input
                          type="text"
                          placeholder="Enter Fiscal Year. eg:2024-2025"
                          id="fiscal-year"
                          value={regFiscalYear}
                          onChange={(e) => setRegFiscalYear(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget-amount">Budget Amount</Label>
                        <Input
                          type="number"
                          placeholder="Enter Budget Amount in Rwf"
                          id="budget-amount"
                          value={regAmount}
                          onChange={(e) => setRegAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget-status">Budget Status</Label>
                      <Select value={regStatus} onValueChange={(v) => setRegStatus(v as EFiscalState)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EFiscalState.ACTIVE}>Active</SelectItem>
                          <SelectItem value={EFiscalState.INACTIVE}>Inactive</SelectItem>
                          <SelectItem value={EFiscalState.COMPLETED}>Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter a description for this budget register"
                        rows={3}
                        value={regDescription}
                        onChange={(e) => setRegDescription(e.target.value)}
                      />
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
    </div >
  )
}
