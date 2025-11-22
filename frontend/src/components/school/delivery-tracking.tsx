
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Check, Clock, Loader2, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface Item {
  id: string
  name: string
  unit?: string
}

interface ApiOrder {
  id: string
  requestItem?: {
    id: string
    requestItemDetails?: Array<{
      id: string
      item: { id: string; name?: string }
      quantity: number
    }>
    created?: string
    updated?: string
  }
  supplier?: {
    id: string
    companyName?: string
    name?: string
    user?: {
      id: string
      name?: string
    }
  }
  deliveryStatus?: string
  orderPrice?: number
  created?: string
  updated?: string
}

interface Delivery {
  id: string
  items: string
  supplier: string
  orderedDate: string
  estimatedDelivery?: string
  deliveredDate?: string
  status: string
  timeline: Array<{
    status: string
    time: string
    completed: boolean
  }>
}

export function DeliveryTracking() {
  const [activeTab, setActiveTab] = useState("current")
  const [currentDeliveries, setCurrentDeliveries] = useState<Delivery[]>([])
  const [pastDeliveries, setPastDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])

  // Fetch items to map IDs to names
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8070/api/item/all")
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (err) {
        console.error("Error fetching items:", err)
      }
    }
    fetchItems()
  }, [])

  // Fetch current delivery
  useEffect(() => {
    const fetchCurrentDelivery = async () => {
      const schoolId = localStorage.getItem("schoolId")
      const token = localStorage.getItem("token")

      if (!schoolId || !token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:8070/api/track/current/${schoolId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.status === 404) {
          // No current order found
          setCurrentDeliveries([])
          setLoading(false)
          return
        }

        if (!response.ok) {
          // Try to get error message
          const contentType = response.headers.get("content-type")
          let errorMessage = "Failed to fetch current delivery"
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json()
              errorMessage = errorData?.message || errorData || errorMessage
            } catch {
              // Ignore JSON parse errors
            }
          } else {
            try {
              const errorText = await response.text()
              if (errorText) errorMessage = errorText
            } catch {
              // Ignore text parse errors
            }
          }
          throw new Error(errorMessage)
        }

        // Handle response that might be JSON or plain text
        const contentType = response.headers.get("content-type")
        let order: ApiOrder | null = null
        if (contentType && contentType.includes("application/json")) {
          order = await response.json()
        } else {
          // If not JSON, might be an error message
          const text = await response.text()
          if (text && !text.includes("Order not found")) {
            throw new Error(text)
          }
        }

        if (order) {
          const transformed = transformOrderToDelivery(order, items)
          setCurrentDeliveries(transformed ? [transformed] : [])
        } else {
          setCurrentDeliveries([])
        }
      } catch (err: any) {
        console.error("Error fetching current delivery:", err)
        setCurrentDeliveries([])
        toast({
          title: "Error",
          description: err?.message || "Failed to load current delivery. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (items.length > 0) {
      fetchCurrentDelivery()
    }
  }, [items])

  // Fetch past deliveries
  useEffect(() => {
    const fetchPastDeliveries = async () => {
      const schoolId = localStorage.getItem("schoolId")
      const token = localStorage.getItem("token")

      if (!schoolId || !token) {
        return
      }

      try {
        const response = await fetch(`http://localhost:8070/api/track/patDeliveries/${schoolId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          // Try to get error message
          const contentType = response.headers.get("content-type")
          let errorMessage = "Failed to fetch past deliveries"
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json()
              errorMessage = errorData?.message || errorData || errorMessage
            } catch {
              // Ignore JSON parse errors
            }
          } else {
            try {
              const errorText = await response.text()
              if (errorText) errorMessage = errorText
            } catch {
              // Ignore text parse errors
            }
          }
          throw new Error(errorMessage)
        }

        // Handle response that might be JSON array or empty
        const contentType = response.headers.get("content-type")
        let orders: ApiOrder[] = []
        if (contentType && contentType.includes("application/json")) {
          orders = await response.json()
        } else {
          // If not JSON, might be empty or error
          const text = await response.text()
          if (text && !text.includes("not found")) {
            console.warn("Unexpected response format:", text)
          }
        }

        const transformed = orders
          .map((order) => transformOrderToDelivery(order, items))
          .filter((delivery): delivery is Delivery => delivery !== null)
        setPastDeliveries(transformed)
      } catch (err: any) {
        console.error("Error fetching past deliveries:", err)
        setPastDeliveries([])
        toast({
          title: "Error",
          description: err?.message || "Failed to load past deliveries. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (items.length > 0) {
      fetchPastDeliveries()
    }
  }, [items])

  const transformOrderToDelivery = (order: ApiOrder, itemsList: Item[]): Delivery | null => {
    if (!order) return null

    // Extract items from requestItemDetails
    const itemsString = order.requestItem?.requestItemDetails
      ?.map((detail) => {
        const item = itemsList.find((i) => i.id === detail.item.id)
        return item?.name || detail.item.name || `Item ${detail.item.id.substring(0, 8)}`
      })
      .join(", ") || "No items"

    // Get supplier name
    const supplierName =
      order.supplier?.companyName ||
      order.supplier?.name ||
      order.supplier?.user?.name ||
      "Unknown Supplier"

    // Map delivery status
    const deliveryStatus = order.deliveryStatus?.toLowerCase() || "pending"
    const statusMap: Record<string, string> = {
      pending: "ordered",
      processing: "processing",
      dispatched: "dispatched",
      delivered: "delivered",
    }
    const frontendStatus = statusMap[deliveryStatus] || deliveryStatus

    // Format dates
    const orderedDate = order.requestItem?.created
      ? new Date(order.requestItem.created).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date"

    const estimatedDelivery = order.requestItem?.updated
      ? new Date(order.requestItem.updated).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined

    const deliveredDate =
      frontendStatus === "delivered" && order.updated
        ? new Date(order.updated).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : undefined

    // Build timeline based on status
    const timeline = buildTimeline(order, frontendStatus, orderedDate, deliveredDate, estimatedDelivery)

    return {
      id: order.id,
      items: itemsString,
      supplier: supplierName,
      orderedDate,
      estimatedDelivery,
      deliveredDate,
      status: frontendStatus,
      timeline,
    }
  }

  const buildTimeline = (
    order: ApiOrder,
    status: string,
    orderedDate: string,
    deliveredDate?: string,
    estimatedDelivery?: string
  ): Array<{ status: string; time: string; completed: boolean }> => {
    const timeline: Array<{ status: string; time: string; completed: boolean }> = []

    // Ordered
    const orderedTime = order.requestItem?.created
      ? new Date(order.requestItem.created).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : `${orderedDate} - Unknown time`
    timeline.push({ status: "ordered", time: orderedTime, completed: true })

    // Approved (assume it's approved if there's an order)
    const approvedTime = order.requestItem?.updated
      ? new Date(order.requestItem.updated).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : `${orderedDate} - Unknown time`
    timeline.push({ status: "approved", time: approvedTime, completed: true })

    // Processing
    const processingCompleted = ["processing", "dispatched", "delivered"].includes(status)
    timeline.push({
      status: "processing",
      time: processingCompleted ? approvedTime : "Pending",
      completed: processingCompleted,
    })

    // Dispatched
    const dispatchedCompleted = ["dispatched", "delivered"].includes(status)
    const dispatchedTime = order.updated
      ? new Date(order.updated).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Pending"
    timeline.push({
      status: "dispatched",
      time: dispatchedCompleted ? dispatchedTime : `Expected ${estimatedDelivery || "soon"}`,
      completed: dispatchedCompleted,
    })

    // Delivered
    const deliveredCompleted = status === "delivered"
    timeline.push({
      status: "delivered",
      time: deliveredCompleted
        ? deliveredDate
          ? `${deliveredDate} - ${new Date(order.updated || "").toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}`
          : "Delivered"
        : `Expected ${estimatedDelivery || "soon"}`,
      completed: deliveredCompleted,
    })

    return timeline
  }

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
                {loading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading deliveries...</p>
                    </CardContent>
                  </Card>
                ) : currentDeliveries.length > 0 ? (
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
                {loading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading past deliveries...</p>
                    </CardContent>
                  </Card>
                ) : pastDeliveries.length > 0 ? (
                  pastDeliveries.map((delivery) => (
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
                ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-muted p-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No Past Deliveries</h3>
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        You don't have any past deliveries yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
