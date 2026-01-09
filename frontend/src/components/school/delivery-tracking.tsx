
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Check, Clock, Loader2, Truck, Star } from "lucide-react"
import apiClient from "@/lib/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Item {
  id: string
  name: string
  unit?: string
}

interface BackendOrder {
  id?: string
  created?: string
  updated?: string
  requestItem?: {
    id?: string
    created?: string
    updated?: string
    description?: string
    requestStatus?: string
    school?: {
      id?: string
      name?: string
      address?: string
      email?: string
      phone?: string
      student?: number
      directorNames?: string
      district?: {
        id?: string
        province?: string
        district?: string
      }
    }
    district?: {
      id?: string
      province?: string
      district?: string
    }
    requestItemDetails?: Array<{
      id?: string
      quantity?: number
      item?: {
        id?: string
        name?: string
        perStudent?: number
        description?: string
      }
    }>
  }
  supplier?: {
    id?: string
    names?: string
    email?: string
    phone?: string
    companyName?: string
    items?: Array<{
      id?: string
      name?: string
      perStudent?: number
      description?: string
    }>
  }
  deliveryDate?: string | null
  deliveryStatus?: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED"
  orderPrice?: number
  orderPayState?: "PENDING" | "PAYED" | "CANCELLED"
  rating?: number
  [key: string]: any
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
  originalOrder?: BackendOrder
}

const receivingService = {
  receiveOrder: async (id: string, rating: number) => {
    const response = await apiClient.put(`/receiving/receivingOrder/${id}?rating=${rating}`, {})
    return response.data
  },
}

export function DeliveryTracking() {
  const [activeTab, setActiveTab] = useState("current")
  const [currentDeliveries, setCurrentDeliveries] = useState<Delivery[]>([])
  const [pastDeliveries, setPastDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch items to map IDs to names (optional, we'll use supplier items if available)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiClient.get("/item/all")
        setItems(response.data)
      } catch (err) {
        console.error("Error fetching items:", err)
        // Continue without items, we'll use supplier items instead
      }
    }
    fetchItems()
  }, [])

  // Fetch current deliveries (returns list of orders not yet delivered)
  useEffect(() => {
    const fetchCurrentDeliveries = async () => {
      const schoolId = localStorage.getItem("schoolId")

      if (!schoolId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiClient.get(`/track/current/${schoolId}`)

        // API returns List<Orders>
        const orders: BackendOrder[] = response.data

        if (orders && Array.isArray(orders) && orders.length > 0) {
          const transformed = orders
            .map((order) => transformOrderToDelivery(order, items))
            .filter((delivery): delivery is Delivery => delivery !== null)
          // Store original order data with each delivery
          transformed.forEach((delivery, index) => {
            delivery.originalOrder = orders[index]
          })
          setCurrentDeliveries(transformed)
        } else {
          setCurrentDeliveries([])
        }
      } catch (err: any) {
        console.error("Error fetching current deliveries:", err)
        setCurrentDeliveries([])
        toast.error(err?.message || "Failed to load current deliveries. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentDeliveries()
  }, [items])

  // Fetch past deliveries
  useEffect(() => {
    const fetchPastDeliveries = async () => {
      const schoolId = localStorage.getItem("schoolId")

      if (!schoolId) {
        return
      }

      try {
        const response = await apiClient.get(`/track/patDeliveries/${schoolId}`)
        // API returns List<Orders> with DELIVERED status
        const orders: BackendOrder[] = response.data

        if (orders && Array.isArray(orders)) {
          const transformed = orders
            .map((order) => transformOrderToDelivery(order, items))
            .filter((delivery): delivery is Delivery => delivery !== null)
          // Store original order data with each delivery
          transformed.forEach((delivery, index) => {
            delivery.originalOrder = orders[index]
          })
          setPastDeliveries(transformed)
        } else {
          setPastDeliveries([])
        }
      } catch (err: any) {
        console.error("Error fetching past deliveries:", err)
        setPastDeliveries([])
        toast.error(err?.message || "Failed to load past deliveries. Please try again.")
      }
    }

    if (items.length > 0) {
      fetchPastDeliveries()
    }
  }, [items])

  const transformOrderToDelivery = (order: BackendOrder, itemsList: Item[]): Delivery | null => {
    if (!order || !order.id) return null

    // Extract items from requestItemDetails
    const requestItemDetails = order.requestItem?.requestItemDetails || []
    const items: string[] = []

    // Get item names from supplier's items array by matching IDs (preferred)
    const supplierItems = order.supplier?.items || []
    const itemMap = new Map(supplierItems.map(item => [item.id, item.name]))

    // Also create a map from itemsList for fallback
    const itemsListMap = new Map(itemsList.map(item => [item.id, item.name]))

    requestItemDetails.forEach((detail) => {
      const itemId = detail.item?.id
      if (itemId) {
        // Try supplier items first, then itemsList, then fallback
        const itemName = itemMap.get(itemId) || itemsListMap.get(itemId) || detail.item?.name || `Item ${itemId.substring(0, 8)}`
        const quantity = detail.quantity || 0
        items.push(`${itemName} (${quantity} kg)`)
      }
    })

    const itemsString = items.length > 0 ? items.join(", ") : "No items"

    // Get supplier name
    const supplierName =
      order.supplier?.companyName ||
      order.supplier?.names ||
      "Unknown Supplier"

    // Map delivery status from enum to frontend status
    const deliveryStatus = order.deliveryStatus?.toUpperCase() || "SCHEDULED"
    const statusMap: Record<string, string> = {
      APPROVED: "approved",
      SCHEDULED: "scheduled",
      PROCESSING: "processing",
      DELIVERED: "delivered",
      CANCELLED: "cancelled",
    }
    const frontendStatus = statusMap[deliveryStatus] || deliveryStatus.toLowerCase()

    // Format dates
    const orderedDate = order.requestItem?.created || order.created
      ? new Date(order.requestItem?.created || order.created || "").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "Unknown date"

    const estimatedDelivery = order.expectedDate
      ? new Date(order.expectedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : undefined

    const deliveredDate =
      (frontendStatus === "delivered" || deliveryStatus === "DELIVERED") && order.deliveryDate
        ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
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
    order: BackendOrder,
    status: string,
    orderedDate: string,
    deliveredDate?: string,
    estimatedDelivery?: string
  ): Array<{ status: string; time: string; completed: boolean }> => {
    const timeline: Array<{ status: string; time: string; completed: boolean }> = []

    // 1. Request
    const requestTime = order.requestItem?.created
      ? new Date(order.requestItem.created).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      })
      : `${orderedDate}`
    timeline.push({ status: "request", time: requestTime, completed: true })

    // 2. Approve (District)
    const districtApproved = order.requestItem?.requestStatus === "APPROVE"
    const approveTime = districtApproved && order.requestItem?.updated
      ? new Date(order.requestItem.updated).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      })
      : "Pending"
    timeline.push({ status: "approve", time: approveTime, completed: districtApproved })

    // 3. Processing
    const processingCompleted = ["processing", "approved", "delivered"].includes(status) || order.deliveryStatus === "PROCESSING"
    const processingTime = (order.deliveryStatus === "PROCESSING" || processingCompleted) && order.updated
      ? new Date(order.updated).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      })
      : "Pending"
    timeline.push({ status: "processing", time: processingCompleted ? processingTime : "Pending", completed: processingCompleted })

    // 4. Receive (School/Supplier Delivery Status Approved)
    const schoolApproveCompleted = ["approved", "delivered"].includes(status) || order.deliveryStatus === "APPROVED" || order.deliveryStatus === "DELIVERED"
    const schoolApproveTime = schoolApproveCompleted && order.updated
      ? new Date(order.updated).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      })
      : "Pending"
    timeline.push({ status: "receive", time: schoolApproveTime, completed: schoolApproveCompleted })

    // 5. Delivered
    const deliveredCompleted = status === "delivered" || order.deliveryStatus === "DELIVERED"
    const deliveredTime = deliveredCompleted && order.deliveryDate
      ? new Date(order.deliveryDate).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      })
      : "Pending"
    timeline.push({ status: "delivered", time: deliveredCompleted ? deliveredTime : "Pending", completed: deliveredCompleted })

    return timeline
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ordered":
        return <Badge variant="outline">Ordered</Badge>
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-600 text-white border-green-700">
            Approved
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Processing
          </Badge>
        )
      case "delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Helper function to get item name from supplier items array
  const getItemName = (order: BackendOrder, itemId?: string) => {
    if (!itemId || !order.supplier?.items) return "N/A"
    const item = order.supplier.items.find(i => i.id === itemId)
    return item?.name || "N/A"
  }

  // Helper function to get item unit from supplier items array
  const getItemUnit = (order: BackendOrder, itemId?: string) => {
    if (!itemId || !order.supplier?.items) return "kg"
    const item = order.supplier.items.find(i => i.id === itemId)
    // Default to "kg" as unit property may not exist in supplier items
    return "kg"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  const handleReceiveDelivery = async () => {
    if (!selectedOrder || !selectedOrder.id) return
    if (rating === 0) {
      toast.error("Please provide a rating before receiving the order")
      return
    }

    try {
      setIsProcessing(true)
      await receivingService.receiveOrder(selectedOrder.id, rating)

      // Refresh the current deliveries list
      const schoolId = localStorage.getItem("schoolId")

      if (schoolId) {
        try {
          const response = await apiClient.get(`/track/current/${schoolId}`)
          const orders: BackendOrder[] = response.data
          if (orders && Array.isArray(orders) && orders.length > 0) {
            const transformed = orders
              .map((order) => transformOrderToDelivery(order, items))
              .filter((delivery): delivery is Delivery => delivery !== null)
            transformed.forEach((delivery, index) => {
              delivery.originalOrder = orders[index]
            })
            setCurrentDeliveries(transformed)
          } else {
            setCurrentDeliveries([])
          }
        } catch (err) {
          console.error("Error refreshing deliveries:", err)
        }
      }

      toast.success("Order received successfully")
      setReceiveDialogOpen(false)
      setSelectedOrder(null)
      setRating(0)
    } catch (err: any) {
      console.error("Error receiving order:", err)
      toast.error(err.response?.data || err.message || "Failed to receive order")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/school-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
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
                                    className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${event.completed
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

                        {(delivery.status === "scheduled" || delivery.status === "processing") && (
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Truck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium">Approve Receiving</h3>
                                <p className="text-xs text-muted-foreground">Approve the receiving of the delivery</p>
                              </div>
                              <Button
                                className="ml-auto"
                                size="sm"
                                onClick={() => {
                                  if (delivery.originalOrder) {
                                    setSelectedOrder(delivery.originalOrder)
                                    setRating(0)
                                    setReceiveDialogOpen(true)
                                  }
                                }}
                                disabled={isProcessing}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        )}
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

      {/* Receive Delivery Dialog */}
      {selectedOrder && (
        <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Approve Receiving</DialogTitle>
              <DialogDescription>Verify and receive incoming delivery items. Please rate the supplier before confirming receipt.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedOrder.supplier?.companyName || selectedOrder.supplier?.names || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p>{formatDate(selectedOrder.deliveryDate || selectedOrder.created)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Price</p>
                  <p className="font-medium">{selectedOrder.orderPrice ? `RWF ${selectedOrder.orderPrice.toLocaleString()}` : "N/A"}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-2 text-sm font-medium">Order Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Expected Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.requestItem?.requestItemDetails && selectedOrder.requestItem.requestItemDetails.length > 0 ? (
                        selectedOrder.requestItem.requestItemDetails.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{getItemName(selectedOrder, detail.item?.id)}</TableCell>
                            <TableCell>{detail.quantity || 0}</TableCell>
                            <TableCell>{getItemUnit(selectedOrder, detail.item?.id)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rate Supplier *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-300 text-gray-300 hover:fill-amber-200 hover:text-amber-200"
                          }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Click on a star to rate the supplier for this delivery</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this delivery"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => {
                setReceiveDialogOpen(false)
                setRating(0)
              }}>
                Cancel
              </Button>
              <Button onClick={handleReceiveDelivery} disabled={isProcessing || rating === 0}>
                <Check className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Confirm Receipt"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
