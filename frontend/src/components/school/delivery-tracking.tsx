
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Check, Clock, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function DeliveryTracking() {
  const [activeTab, setActiveTab] = useState("current")

  const currentDeliveries = [
    {
      id: "DEL-2025-042",
      items: "Rice, Beans, Vegetables",
      supplier: "Kigali Foods Ltd",
      orderedDate: "Apr 6, 2025",
      estimatedDelivery: "Apr 8, 2025",
      status: "dispatched",
      timeline: [
        { status: "ordered", time: "Apr 6, 2025 - 10:30 AM", completed: true },
        { status: "approved", time: "Apr 6, 2025 - 2:15 PM", completed: true },
        { status: "processing", time: "Apr 7, 2025 - 9:00 AM", completed: true },
        { status: "dispatched", time: "Apr 7, 2025 - 2:30 PM", completed: true },
        { status: "delivered", time: "Expected Apr 8, 2025", completed: false },
      ],
    },
  ]

  const pastDeliveries = [
    {
      id: "DEL-2025-041",
      items: "Maize, Potatoes, Fruits",
      supplier: "Rwanda Harvest Co.",
      orderedDate: "Apr 1, 2025",
      deliveredDate: "Apr 3, 2025",
      status: "delivered",
      timeline: [
        { status: "ordered", time: "Apr 1, 2025 - 9:15 AM", completed: true },
        { status: "approved", time: "Apr 1, 2025 - 11:30 AM", completed: true },
        { status: "processing", time: "Apr 2, 2025 - 8:45 AM", completed: true },
        { status: "dispatched", time: "Apr 2, 2025 - 1:20 PM", completed: true },
        { status: "delivered", time: "Apr 3, 2025 - 10:05 AM", completed: true },
      ],
    },
    {
      id: "DEL-2025-039",
      items: "Rice, Beans, Oil",
      supplier: "Kigali Foods Ltd",
      orderedDate: "Mar 26, 2025",
      deliveredDate: "Mar 28, 2025",
      status: "delivered",
      timeline: [
        { status: "ordered", time: "Mar 26, 2025 - 11:20 AM", completed: true },
        { status: "approved", time: "Mar 26, 2025 - 3:45 PM", completed: true },
        { status: "processing", time: "Mar 27, 2025 - 9:30 AM", completed: true },
        { status: "dispatched", time: "Mar 27, 2025 - 2:15 PM", completed: true },
        { status: "delivered", time: "Mar 28, 2025 - 11:10 AM", completed: true },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ordered":
        return <Badge variant="outline">Ordered</Badge>
      case "approved":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Approved
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Processing
          </Badge>
        )
      case "dispatched":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Dispatched</Badge>
      case "delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/school-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">Track Food Deliveries</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current Deliveries</TabsTrigger>
                <TabsTrigger value="past">Past Deliveries</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-6 space-y-6">
                {currentDeliveries.length > 0 ? (
                  currentDeliveries.map((delivery) => (
                    <Card key={delivery.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Delivery #{delivery.id}</CardTitle>
                            <CardDescription>
                              Ordered on {delivery.orderedDate} • Expected delivery: {delivery.estimatedDelivery}
                            </CardDescription>
                          </div>
                          {getStatusBadge(delivery.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                            <p>{delivery.items}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                            <p>{delivery.supplier}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Current Status</h3>
                            <p className="capitalize">{delivery.status}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Delivery Timeline</h3>
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-2.5 top-0 h-full w-0.5 bg-muted"></div>

                            {/* Timeline events */}
                            <div className="space-y-6">
                              {delivery.timeline.map((event, index) => (
                                <div key={index} className="relative flex gap-4">
                                  <div
                                    className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${
                                      event.completed
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-muted bg-background"
                                    }`}
                                  >
                                    {event.completed && <Check className="h-3 w-3" />}
                                  </div>
                                  <div className="flex-1 pt-0.5">
                                    <h4 className="text-sm font-medium capitalize">{event.status}</h4>
                                    <p className="text-xs text-muted-foreground">{event.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">Live Tracking</h3>
                              <p className="text-xs text-muted-foreground">Delivery vehicle is currently in transit</p>
                            </div>
                            <Button className="ml-auto" size="sm">
                              View Map
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-muted p-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No Current Deliveries</h3>
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        There are no active deliveries at the moment.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link to="/request-food">Request Food</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-6 space-y-6">
                {pastDeliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Delivery #{delivery.id}</CardTitle>
                          <CardDescription>
                            Ordered on {delivery.orderedDate} • Delivered on {delivery.deliveredDate}
                          </CardDescription>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                          <p>{delivery.items}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                          <p>{delivery.supplier}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                          <p className="capitalize">{delivery.status}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Delivery Timeline</h3>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-2.5 top-0 h-full w-0.5 bg-muted"></div>

                          {/* Timeline events */}
                          <div className="space-y-6">
                            {delivery.timeline.map((event, index) => (
                              <div key={index} className="relative flex gap-4">
                                <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <h4 className="text-sm font-medium capitalize">{event.status}</h4>
                                  <p className="text-xs text-muted-foreground">{event.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
