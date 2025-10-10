
import { useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Bell, Download, FileText, Home, LogOut, PieChart, Settings, TrendingUp, User } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartTitle,
  ChartDescription,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
  ChartLine,
  ChartPie,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function GovAnalytics() {
  const [period, setPeriod] = useState("month")
  const [district, setDistrict] = useState("all")

  // Sample data for charts
  const schoolsCoveredData = [
    { name: "Kigali", value: 45 },
    { name: "Eastern", value: 38 },
    { name: "Northern", value: 32 },
    { name: "Western", value: 30 },
    { name: "Southern", value: 35 },
  ]

  const deliveryDelaysData = [
    { date: "Jan", onTime: 92, delayed: 8 },
    { date: "Feb", onTime: 88, delayed: 12 },
    { date: "Mar", onTime: 95, delayed: 5 },
    { date: "Apr", onTime: 90, delayed: 10 },
    { date: "May", onTime: 93, delayed: 7 },
    { date: "Jun", onTime: 97, delayed: 3 },
  ]

  const budgetAllocationData = [
    { name: "Food Supplies", value: 65 },
    { name: "Transportation", value: 15 },
    { name: "Staff", value: 10 },
    { name: "Infrastructure", value: 7 },
    { name: "Other", value: 3 },
  ]

  const nutritionComplianceData = [
    { date: "Jan", actual: 85, target: 90 },
    { date: "Feb", actual: 87, target: 90 },
    { date: "Mar", actual: 92, target: 90 },
    { date: "Apr", actual: 94, target: 90 },
    { date: "May", actual: 95, target: 90 },
    { date: "Jun", actual: 96, target: 90 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const handleExport = (format: string) => {
    // In a real app, this would generate and download a report
    console.log(`Exporting data in ${format} format`)
    alert(`Data would be exported as ${format.toUpperCase()} in a real application`)
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/gov-dashboard" className="lg:hidden">
            <BarChart3 className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
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
                    <AvatarFallback>GV</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Government Official</p>
                    <p className="text-xs leading-none text-muted-foreground">official@mineduc.gov.rw</p>
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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">School Feeding Program Analytics</h2>
              <p className="text-muted-foreground">Comprehensive data analysis and visualization</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="kigali">Kigali</SelectItem>
                  <SelectItem value="eastern">Eastern</SelectItem>
                  <SelectItem value="northern">Northern</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                  <SelectItem value="southern">Southern</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schools">Schools</TabsTrigger> 
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">180</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Students Fed</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45,231</div>
                    <p className="text-xs text-muted-foreground">+2,345 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivery Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">93%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Schools Covered by Region</CardTitle>
                    <CardDescription>Distribution of schools in the feeding program</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Chart>
                      <ChartContainer>
                        <ChartTitle>Schools by Region</ChartTitle>
                        <ChartDescription>Number of schools in each region</ChartDescription>
                        <ChartBar data={schoolsCoveredData} xAxis="name" yAxis="value" colorScheme="blue" />
                        <ChartGrid />
                        <ChartXAxis dataKey="name" />
                        <ChartYAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                      </ChartContainer>
                    </Chart>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Performance</CardTitle>
                    <CardDescription>On-time vs delayed deliveries</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Chart>
                      <ChartContainer>
                        <ChartTitle>Delivery Performance</ChartTitle>
                        <ChartDescription>Monthly delivery statistics</ChartDescription>
                        <ChartLine
                          data={deliveryDelaysData}
                          xAxis="date"
                          series={[
                            { name: "On Time", valueKey: "onTime", color: "#10b981" },
                            { name: "Delayed", valueKey: "delayed", color: "#ef4444" },
                          ]}
                        />
                        <ChartGrid />
                        <ChartXAxis dataKey="date" />
                        <ChartYAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartLegend>
                          <ChartLegendItem name="On Time" color="#10b981" />
                          <ChartLegendItem name="Delayed" color="#ef4444" />
                        </ChartLegend>
                      </ChartContainer>
                    </Chart>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Allocation</CardTitle>
                    <CardDescription>Distribution of program budget</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Chart>
                      <ChartContainer>
                        <ChartTitle>Budget Allocation</ChartTitle>
                        <ChartDescription>Percentage of budget by category</ChartDescription>
                        <ChartPie data={budgetAllocationData} category="name" value="value" colors={COLORS} />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartLegend>
                          {budgetAllocationData.map((entry, index) => (
                            <ChartLegendItem
                              key={`item-${index}`}
                              name={entry.name}
                              color={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </ChartLegend>
                      </ChartContainer>
                    </Chart>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Compliance</CardTitle>
                    <CardDescription>Actual vs target nutrition standards</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Chart>
                      <ChartContainer>
                        <ChartTitle>Nutrition Compliance</ChartTitle>
                        <ChartDescription>Monthly nutrition metrics</ChartDescription>
                        <ChartLine
                          data={nutritionComplianceData}
                          xAxis="date"
                          series={[
                            { name: "Actual", valueKey: "actual", color: "#3b82f6" },
                            { name: "Target", valueKey: "target", color: "#6b7280", strokeDasharray: "5 5" },
                          ]}
                        />
                        <ChartGrid />
                        <ChartXAxis dataKey="date" />
                        <ChartYAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <ChartLegend>
                          <ChartLegendItem name="Actual" color="#3b82f6" />
                          <ChartLegendItem name="Target" color="#6b7280" />
                        </ChartLegend>
                      </ChartContainer>
                    </Chart>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schools">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>School Enrollment vs Participation</CardTitle>
                    <CardDescription>
                      Comparison of enrolled students vs those participating in feeding program
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Kigali Primary Schools</span>
                        <span className="text-sm font-medium">98% participation</span>
                      </div>
                      <Progress value={98} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Eastern Province Schools</span>
                        <span className="text-sm font-medium">95% participation</span>
                      </div>
                      <Progress value={95} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Northern Province Schools</span>
                        <span className="text-sm font-medium">92% participation</span>
                      </div>
                      <Progress value={92} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Western Province Schools</span>
                        <span className="text-sm font-medium">89% participation</span>
                      </div>
                      <Progress value={89} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Southern Province Schools</span>
                        <span className="text-sm font-medium">94% participation</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>School Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators by school type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Primary Schools</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>On-time delivery</span>
                            <span>96%</span>
                          </div>
                          <Progress value={96} className="h-3" /> 
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Secondary Schools</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>On-time delivery</span>
                            <span>93%</span>
                          </div>
                          <Progress value={93} className="h-3" /> 
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Technical Schools</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>On-time delivery</span>
                            <span>89%</span>
                          </div>
                          <Progress value={89} className="h-3" /> 
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
 

            <TabsContent value="budget">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Allocation by Category</CardTitle>
                    <CardDescription>Distribution of program budget across categories</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Food Procurement</span>
                          <span className="text-sm">RWF 1.56B (65%)</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Transportation</span>
                          <span className="text-sm">RWF 360M (15%)</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Staff & Operations</span>
                          <span className="text-sm">RWF 240M (10%)</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Infrastructure</span>
                          <span className="text-sm">RWF 168M (7%)</span>
                        </div>
                        <Progress value={7} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Other Expenses</span>
                          <span className="text-sm">RWF 72M (3%)</span>
                        </div>
                        <Progress value={3} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Utilization by Province</CardTitle>
                    <CardDescription>Budget usage across different provinces</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">87%</div>
                          <div className="text-xs text-muted-foreground">Overall Utilization</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">RWF 2.09B</div>
                          <div className="text-xs text-muted-foreground">Spent to Date</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Kigali City</span>
                          <div className="flex items-center gap-2">
                            <Progress value={92} className="h-2 w-20" />
                            <span className="text-xs">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Eastern Province</span>
                          <div className="flex items-center gap-2">
                            <Progress value={89} className="h-2 w-20" />
                            <span className="text-xs">89%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Northern Province</span>
                          <div className="flex items-center gap-2">
                            <Progress value={85} className="h-2 w-20" />
                            <span className="text-xs">85%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Western Province</span>
                          <div className="flex items-center gap-2">
                            <Progress value={83} className="h-2 w-20" />
                            <span className="text-xs">83%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Southern Province</span>
                          <div className="flex items-center gap-2">
                            <Progress value={86} className="h-2 w-20" />
                            <span className="text-xs">86%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
