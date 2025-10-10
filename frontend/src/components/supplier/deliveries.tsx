
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Calendar, CheckCircle, Clock, Filter, LogOut, MapPin, Search, Settings, Truck, User, XCircle } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SupplierDeliveries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const deliveries = [
    {
      id: "DEL-2025-089",
      orderId: "ORD-2025-156",
      school: "Kigali Primary School",
      address: "KN 4 Ave, Nyarugenge, Kigali",
      items: "Rice (500kg), Beans (200kg), Cooking Oil (50L)",
      scheduledDate: "2025-04-15",
      scheduledTime: "08:00 AM",
      status: "scheduled",
      driver: "Jean Baptiste",
      vehicle: "RAD 123 A",
      contact: "+250 788 123 456",
    },
    {
      id: "DEL-2025-088",
      orderId: "ORD-2025-155",
      school: "Nyamirambo Secondary",
      address: "KG 15 St, Nyamirambo, Kigali",
      items: "Maize Flour (300kg), Salt (25kg), Sugar (100kg)",
      scheduledDate: "2025-04-14",
      scheduledTime: "09:30 AM",
      status: "delivered",
      driver: "Marie Claire",
      vehicle: "RAD 456 B",
      contact: "+250 788 654 321",
      deliveredAt: "2025-04-14 09:45 AM",
    },
    {
      id: "DEL-2025-087",
      orderId: "ORD-2025-154",
      school: "Remera High School",
      address: "KG 7 Ave, Remera, Kigali",
      items: "Fresh Vegetables (150kg), Meat (80kg)",
      scheduledDate: "2025-04-13",
      scheduledTime: "10:00 AM",
      status: "in-transit",
      driver: "Paul Kagame",
      vehicle: "RAD 789 C",
      contact: "+250 788 987 654",
    },
    {
      id: "DEL-2025-086",
      orderId: "ORD-2025-153",
      school: "Gasabo Primary",
      address: "KG 12 St, Gasabo, Kigali",
      items: "Milk (200L), Bread (500 loaves), Eggs (1000 pieces)",
      scheduledDate: "2025-04-12",
      scheduledTime: "07:30 AM",
      status: "delivered",
      driver: "Agnes Uwimana",
      vehicle: "RAD 321 D",
      contact: "+250 788 111 222",
      deliveredAt: "2025-04-12 07:45 AM",
    },
    {
      id: "DEL-2025-085",
      orderId: "ORD-2025-152",
      school: "Kimisagara Primary",
      address: "KG 3 Ave, Kimisagara, Kigali",
      items: "Fresh Meat (120kg), Spices (15kg)",
      scheduledDate: "2025-04-11",
      scheduledTime: "11:00 AM",
      status: "cancelled",
      driver: "Eric Nzeyimana",
      vehicle: "RAD 555 E",
      contact: "+250 788 333 444",
      cancelReason: "School requested postponement",
    },
  ]

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "in-transit":
        return <Badge className="bg-blue-600 hover:bg-blue-700">In Transit</Badge>
      case "scheduled":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Scheduled</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-transit":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-purple-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUpdateStatus = (deliveryId: string, newStatus: string) => {
    console.log(`Updating delivery ${deliveryId} to ${newStatus}`)
    // Here you would typically make an API call to update the status
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/supplier-dashboard" className="lg:hidden">
            <Truck className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Delivery Management</h1>
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
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Fresh Foods Ltd</p>
                    <p className="text-xs leading-none text-muted-foreground">supplier@freshfoods.rw</p>
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
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Deliveries</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Management</CardTitle>
                  <CardDescription>Track and manage all your deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search deliveries..."
                          className="w-full pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Filter:</span>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Delivery ID</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Scheduled</TableHead>
                          <TableHead>Driver</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeliveries.length > 0 ? (
                          filteredDeliveries.map((delivery) => (
                            <TableRow key={delivery.id}>
                              <TableCell className="font-medium">{delivery.id}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium">{delivery.school}</p>
                                  <p className="text-xs text-muted-foreground flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {delivery.address}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  <p className="text-sm truncate">{delivery.items}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm">{delivery.scheduledDate}</p>
                                    <p className="text-xs text-muted-foreground">{delivery.scheduledTime}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">{delivery.driver}</p>
                                  <p className="text-xs text-muted-foreground">{delivery.vehicle}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(delivery.status)}
                                  {getStatusBadge(delivery.status)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {delivery.status === "scheduled" && (
                                    <Button size="sm" onClick={() => handleUpdateStatus(delivery.id, "in-transit")}>
                                      Start Delivery
                                    </Button>
                                  )}
                                  {delivery.status === "in-transit" && (
                                    <Button size="sm" onClick={() => handleUpdateStatus(delivery.id, "delivered")}>
                                      Mark Delivered
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No deliveries found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Deliveries</CardTitle>
                  <CardDescription>Deliveries scheduled for upcoming dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveries
                      .filter((d) => d.status === "scheduled")
                      .map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">{delivery.school}</span>
                              <Badge className="bg-purple-600 hover:bg-purple-700">Scheduled</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{delivery.items}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                📅 {delivery.scheduledDate} at {delivery.scheduledTime}
                              </span>
                              <span>
                                🚛 {delivery.driver} - {delivery.vehicle}
                              </span>
                            </div>
                          </div>
                          <Button onClick={() => handleUpdateStatus(delivery.id, "in-transit")}>Start Delivery</Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="in-transit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>In Transit Deliveries</CardTitle>
                  <CardDescription>Deliveries currently on the way</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveries
                      .filter((d) => d.status === "in-transit")
                      .map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{delivery.school}</span>
                              <Badge className="bg-blue-600 hover:bg-blue-700">In Transit</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{delivery.items}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>📞 {delivery.contact}</span>
                              <span>
                                🚛 {delivery.driver} - {delivery.vehicle}
                              </span>
                            </div>
                          </div>
                          <Button onClick={() => handleUpdateStatus(delivery.id, "delivered")}>Mark Delivered</Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivered" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivered Orders</CardTitle>
                  <CardDescription>Successfully completed deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveries
                      .filter((d) => d.status === "delivered")
                      .map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{delivery.school}</span>
                              <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{delivery.items}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>✅ Delivered: {delivery.deliveredAt}</span>
                              <span>
                                🚛 {delivery.driver} - {delivery.vehicle}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline">View Receipt</Button>
                        </div>
                      ))}
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
