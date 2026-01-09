
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Download, PieChart, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { governmentService } from "./service/governmentService"
import { budgetService, BudgetGov, EFiscalState } from "./service/budgetService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface AnalyticsStats {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  utilizationRate: number
}

interface FinancialItem {
  description: string
  amount: number
}

interface PredictionData {
  projectedSpending: number
  utilizationTrend: number
  status: "Safe" | "At Risk" | "Critical"
}

interface BudgetUtilization {
  province: string
  percentage: number
}

export function GovAnalytics() {
  const [period, setPeriod] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsStats>({
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    utilizationRate: 0,
  })
  const [financialReport, setFinancialReport] = useState<FinancialItem[]>([])
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [budgetUtilization, setBudgetUtilization] = useState<BudgetUtilization[]>([])
  const [budgets, setBudgets] = useState<BudgetGov[]>([])

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const data = await budgetService.getAllBudgetGov()
      setBudgets(data)

      // Set initial period to active fiscal year if available
      const activeBudget = data.find(b => b.fiscalState === EFiscalState.ACTIVE)
      if (activeBudget) {
        setPeriod(activeBudget.fiscalYear)
      } else if (data.length > 0) {
        setPeriod(data[0].fiscalYear)
      }
    } catch (error) {
      console.error("Error fetching budgets:", error)
    }
  }

  useEffect(() => {
    if (period) {
      fetchAnalyticsData()
    }
  }, [period])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Find selected budget object
      const selectedBudget = budgets.find(b => b.fiscalYear === period)

      if (selectedBudget) {
        const total = selectedBudget.budget || 0
        const spent = selectedBudget.spentBudget || 0
        const remaining = total - spent
        const utilization = total > 0 ? (spent / total) * 100 : 0

        setStats({
          totalBudget: total,
          totalSpent: spent,
          remainingBudget: remaining,
          utilizationRate: Number(utilization.toFixed(1))
        })

        // Fetch Financial Report
        try {
          const reportData = await governmentService.getNationalFinancialReport(period)
          if (reportData && Array.isArray(reportData)) {
            setFinancialReport(reportData)
          }
        } catch (e) {
          console.warn("Financial report not available for this period", e)
          setFinancialReport([])
        }

        // Calculate Prediction
        // Simple linear projection based on current utilization (assuming mid-year or using utilization as proxy)
        // If utilization is X% and we assume we are halfway through the year (for demo purposes)
        // or more realistically, projecting based on daily burn rate if we had dates.
        // For now, let's use a meaningful simulation:
        const projected = spent * 1.2 // Simulating a 20% increase in needs
        const trend = utilization > 80 ? 115 : utilization > 50 ? 105 : 95

        setPredictionData({
          projectedSpending: Math.round(projected),
          utilizationTrend: trend,
          status: projected > total ? "Critical" : projected > total * 0.9 ? "At Risk" : "Safe"
        })
      }

      // Fetch provincial performance for budget utilization mapping
      const provincePerformance = await governmentService.getProvincePerformance()
      if (provincePerformance && Array.isArray(provincePerformance)) {
        setBudgetUtilization(provincePerformance.map((item: any) => ({
          province: item[0], // Province name
          percentage: parseFloat(item[1]) || 0
        })))
      }

    } catch (error: any) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex-1 min-w-0">
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <BarChart3 className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
          </div>
          <HeaderActions role="government" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Budget Analytics Dashboard</h2>
              <p className="text-muted-foreground">Detailed fiscal year budget execution and allocation</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  {budgets.map((b) => (
                    <SelectItem key={b.id} value={b.fiscalYear}>
                      FY {b.fiscalYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {/* National Budget KPIs Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : `RWF ${new Intl.NumberFormat("en-RW").format(stats.totalBudget)}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "Loading..." : `FY ${period}`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Spent Budget</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? "..." : `RWF ${new Intl.NumberFormat("en-RW").format(stats.totalSpent)}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "Loading..." : "Spent to date"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {loading ? "..." : `RWF ${new Intl.NumberFormat("en-RW").format(stats.remainingBudget)}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "Loading..." : "Available funds"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : `${stats.utilizationRate}%`}</div>
                  <div className="mt-2">
                    <Progress value={stats.utilizationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Details Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Financial Report Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Report Breakdown</CardTitle>
                  <CardDescription>Direct fiscal expenditures for FY {period}</CardDescription>
                </CardHeader>
                <CardContent className="h-80 overflow-auto">
                  <div className="space-y-4">
                    {loading && financialReport.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : financialReport.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    ) : (
                      financialReport.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                          <span className="text-sm font-medium">{item.description}</span>
                          <span className="text-sm font-bold">RWF {new Intl.NumberFormat("en-RW").format(item.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Utilization by Province */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization by Province</CardTitle>
                  <CardDescription>Regional budget execution status</CardDescription>
                </CardHeader>
                <CardContent className="h-80 overflow-auto">
                  <div className="space-y-3">
                    {loading && budgetUtilization.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : budgetUtilization.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    ) : (
                      budgetUtilization.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.province}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.percentage} className="h-2 w-20 md:w-32" />
                            <span className="text-xs font-bold">{item.percentage}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Prediction Card */}
              <Card className={predictionData?.status === "Critical" ? "border-red-200 bg-red-50/10" : predictionData?.status === "At Risk" ? "border-amber-200 bg-amber-50/10" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Budget Forecasting
                    {predictionData?.status === "Safe" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 ${predictionData?.status === "Critical" ? "text-red-500" : "text-amber-500"}`} />
                    )}
                  </CardTitle>
                  <CardDescription>Year-end spending projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Projected Year-End Total</div>
                      <div className={`text-2xl font-bold ${predictionData?.status === "Critical" ? "text-red-600" : predictionData?.status === "At Risk" ? "text-amber-600" : "text-primary"}`}>
                        {loading ? "..." : `RWF ${new Intl.NumberFormat("en-RW").format(predictionData?.projectedSpending || 0)}`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Utilization Trend</span>
                        <span>{predictionData?.utilizationTrend}% of planned</span>
                      </div>
                      <Progress
                        value={predictionData?.utilizationTrend}
                        className={`h-3 ${predictionData?.status === "Critical" ? "bg-red-200" : predictionData?.status === "At Risk" ? "bg-amber-200" : ""}`}
                      />
                    </div>

                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-semibold mb-1">Forecast Insight:</div>
                      {predictionData?.status === "Critical" ? (
                        <p className="text-xs text-muted-foreground">Spending is currently out-pacing the budget. Allocation adjustments or spending controls may be required.</p>
                      ) : predictionData?.status === "At Risk" ? (
                        <p className="text-xs text-muted-foreground">Spending is nearing the limit. Monitoring is recommended for the next quarter.</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Budget execution is on track. Projected spending remains within allocated limits.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
