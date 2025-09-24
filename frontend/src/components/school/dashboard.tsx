import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestFoodDialog } from "@/components/school/request-food-dialog";
import { FoodStockGauge } from "@/components/school/food-stock-gauge";

const API_BASE_URL = "http://localhost:8080/api";

interface Inventory {
  id?: string;
  quantity: number;
  foodItem?: { id?: string; name?: string };
  minimumStock?: number;
  maximumStock?: number;
}

interface Request {
  id?: string;
  status: string;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DeliveryItem {
  foodItem?: { name?: string };
}

interface Delivery {
  id?: string;
  deliveryDate?: string;
  status?: string;
  items?: DeliveryItem[];
  supplier?: { name?: string };
}

interface School {
  id?: string;
  name?: string;
  numberOfStudents?: number;
}

export function SchoolDashboard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>({
    foodStock: { percentage: 0, level: "Low" },
    pendingRequests: { total: 0, high: 0, medium: 0, low: 0, approved: 0 },
    nextDelivery: null,
    studentsFedToday: { count: 0, total: 0, progress: 0 },
    recentDeliveries: [],
    upcomingSchedule: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [inventoriesRes, requestsRes, deliveriesRes, schoolRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/inventories`),
            axios.get(`${API_BASE_URL}/requests`),
            axios.get(`${API_BASE_URL}/deliveries`),
            axios.get(`${API_BASE_URL}/schools`),
          ]);

        const inventories = Array.isArray(inventoriesRes.data)
          ? inventoriesRes.data
          : inventoriesRes.data
          ? [inventoriesRes.data]
          : [];

        const requests = Array.isArray(requestsRes.data)
          ? requestsRes.data
          : requestsRes.data
          ? [requestsRes.data]
          : [];

        const deliveries = Array.isArray(deliveriesRes.data)
          ? deliveriesRes.data
          : deliveriesRes.data
          ? [deliveriesRes.data]
          : [];

        const schoolsArray = Array.isArray(schoolRes.data)
          ? schoolRes.data
          : schoolRes.data
          ? [schoolRes.data]
          : [];

        const school =
          schoolsArray.length > 0
            ? schoolsArray[0]
            : { numberOfStudents: 0 };

        // Food Stock
        const totalStock = inventories.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        const maxCapacity = 5000;
        const stockPercentage =
          maxCapacity > 0 ? (totalStock / maxCapacity) * 100 : 0;
        const stockLevel =
          stockPercentage > 75
            ? "High"
            : stockPercentage > 30
            ? "Medium"
            : "Low";

        // Requests
        const pendingRequests = requests.filter(
          (req) => req.status?.trim().toUpperCase() === "PENDING"
        );
        const approvedRequests = requests.filter(
          (req) => req.status?.trim().toUpperCase() === "APPROVED"
        );

        const highPriorityCount = pendingRequests.filter(
          (req) => req.priority?.trim().toUpperCase() === "HIGH"
        ).length;

        const mediumPriorityCount = pendingRequests.filter(
          (req) => req.priority?.trim().toUpperCase() === "MEDIUM"
        ).length;

        const lowPriorityCount = pendingRequests.filter(
          (req) => req.priority?.trim().toUpperCase() === "LOW"
        ).length;

        const noPriorityCount = pendingRequests.filter(
          (req) => !req.priority || req.priority.trim() === ""
        ).length;

        // Next Delivery
        const now = new Date();
        const nextDelivery = deliveries
          .filter((del) => {
            if (!del.deliveryDate) return false;
            const deliveryDate = new Date(del.deliveryDate);
            return (
              deliveryDate > now &&
              del.status?.toUpperCase() !== "DELIVERED" &&
              del.status?.toUpperCase() !== "CANCELLED"
            );
          })
          .sort(
            (a, b) =>
              new Date(a.deliveryDate!).getTime() -
              new Date(b.deliveryDate!).getTime()
          )[0];

        // Students Fed
        const totalStudents = school.numberOfStudents || 0;
        const studentsFed =
          totalStudents > 0 ? Math.floor(totalStudents * 0.85) : 0;
        const studentsProgress = totalStudents
          ? (studentsFed / totalStudents) * 100
          : 0;

        // Recent Deliveries
        const recentDeliveries = deliveries
          .filter((del) => del.status?.toUpperCase() === "DELIVERED")
          .sort((a, b) => {
            const dateA = new Date(b.deliveryDate || b.updatedAt || 0);
            const dateB = new Date(a.deliveryDate || a.updatedAt || 0);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 5)
          .map((del) => ({
            id: del.id || `delivery-${Math.random()}`,
            date: del.deliveryDate
              ? new Date(del.deliveryDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A",
            items:
              del.items
                ?.map((item) => item.foodItem?.name || "Unknown")
                .join(", ") || "No items",
            supplier: del.supplier?.name || "Unknown Supplier",
            status: del.status || "DELIVERED",
          }));

        // Upcoming Schedule
        const upcomingSchedule = requests
          .filter(
            (req) =>
              req.status?.toUpperCase() === "APPROVED" ||
              req.status?.toUpperCase() === "PENDING"
          )
          .slice(0, 4)
          .map((req) => {
            const date = req.updatedAt
              ? new Date(req.updatedAt)
              : new Date(req.createdAt || Date.now());
            return {
              title:
                req.status?.toUpperCase() === "APPROVED"
                  ? "Approved Request Processing"
                  : "Food Request Review",
              date: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              time: date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              status:
                req.status?.toUpperCase() === "APPROVED"
                  ? "Scheduled"
                  : "Upcoming",
            };
          });

        if (upcomingSchedule.length < 6) {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);

          upcomingSchedule.push({
            title: "Weekly Inventory Check",
            date: nextWeek.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: "9:00 AM",
            status: "Upcoming",
          });
        }

        setDashboardData({
          foodStock: {
            percentage: Math.round(stockPercentage),
            level: stockLevel,
          },
          pendingRequests: {
            total: pendingRequests.length,
            high: highPriorityCount,
            medium: mediumPriorityCount + noPriorityCount,
            low: lowPriorityCount,
            approved: approvedRequests.length,
          },
          nextDelivery: nextDelivery
            ? {
                date: new Date(nextDelivery.deliveryDate!).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                ),
                time: new Date(
                  nextDelivery.deliveryDate!
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
              }
            : null,
          studentsFedToday: {
            count: studentsFed,
            total: totalStudents,
            progress: Math.round(studentsProgress),
          },
          recentDeliveries,
          upcomingSchedule,
        });

        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(`Failed to load dashboard data: ${err.message}`);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <p className="text-lg text-destructive mb-2">Dashboard Error</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">School Feeding</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/school-dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              to="/request-food"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <ShoppingCart className="h-4 w-4" /> Request Food
            </Link>
            <Link
              to="/track-delivery"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" /> Track Delivery
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" /> Reports
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" /> <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">School Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      School Admin
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@school.rw
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Food Stock */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Food Stock Level
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <FoodStockGauge value={dashboardData.foodStock.percentage} />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Current stock level: {dashboardData.foodStock.level}
                </p>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.pendingRequests.total}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {dashboardData.pendingRequests.high > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      High: {dashboardData.pendingRequests.high}
                    </Badge>
                  )}
                  {dashboardData.pendingRequests.medium > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Medium: {dashboardData.pendingRequests.medium}
                    </Badge>
                  )}
                  {dashboardData.pendingRequests.low > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Low: {dashboardData.pendingRequests.low}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Approved: {dashboardData.pendingRequests.approved}
                </div>
              </CardContent>
            </Card>

            {/* Next Delivery */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Delivery
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.nextDelivery
                    ? dashboardData.nextDelivery.date
                    : "No upcoming delivery"}
                </div>
                {dashboardData.nextDelivery && (
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.nextDelivery.time}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Students Fed Today */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Students Fed Today
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.studentsFedToday.count}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {dashboardData.studentsFedToday.total} registered
                </p>
                <Progress
                  value={dashboardData.studentsFedToday.progress}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Deliveries & Schedule */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>
                  Overview of recent food deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.recentDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                      <div>Date</div>
                      <div>Items</div>
                      <div>Supplier</div>
                      <div>Status</div>
                    </div>
                    {dashboardData.recentDeliveries.map(
                      (delivery: any, idx: number) => (
                        <div
                          key={idx}
                          className="grid grid-cols-4 items-center text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{delivery.date}</span>
                          </div>
                          <div>{delivery.items}</div>
                          <div>{delivery.supplier}</div>
                          <div>
                            <Badge className="bg-green-500">
                              {delivery.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent deliveries found
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>
                  Food delivery and serving schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingSchedule.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.date}, {item.time}
                        </p>
                      </div>
                      <Badge
                        className="ml-auto"
                        variant={item.status === "Scheduled" ? "default" : "outline"}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setOpen(true)} className="w-full">
                  Request Food
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

      <RequestFoodDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default SchoolDashboard;
