import apiClient from "./axios"

export interface Notification {
  id?: string
  message: string
  type: string
  timestamp?: string
  read?: boolean
  link?: string
}

/**
 * Notification service to fetch notifications based on user role
 */
export const notificationService = {
  /**
   * Get notifications for District role
   * - School requests
   * - Supplier change status of order
   */
  getDistrictNotifications: async (districtId: string): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch pending school requests
      try {
        const requestsResponse = await apiClient.get(
          `/respondDistrict/districtRequest/${districtId}`
        )
        const requests = Array.isArray(requestsResponse.data) ? requestsResponse.data : []

        requests.forEach((request: any) => {
          if (request.requestStatus === "PENDING") {
            const schoolName = request.school?.name || "A school"
            const itemsCount = request.requestItemDetails?.length || 0
            notifications.push({
              id: request.id,
              message: `${schoolName} requested ${itemsCount} item(s)`,
              type: "school_request",
              timestamp: request.created,
              link: `/district-approvals`,
            })
          }
        })
      } catch (err) {
        console.error("Error fetching school requests:", err)
      }

      // Fetch orders with status changes from suppliers
      try {
        const ordersResponse = await apiClient.get(
          `/districtDelivery/deliveriesByDistrict/${districtId}`
        )
        const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : []

        orders.forEach((order: any) => {
          if (order.deliveryStatus && order.deliveryStatus !== "APPROVED") {
            const supplierName = order.supplier?.companyName || order.supplier?.names || "A supplier"
            const status = order.deliveryStatus.toLowerCase().replace("_", " ")
            notifications.push({
              id: order.id,
              message: `${supplierName} changed order status to ${status}`,
              type: "order_status_change",
              timestamp: order.updated,
              link: `/district-approvals`,
            })
          }
        })
      } catch (err) {
        console.error("Error fetching order status changes:", err)
      }
    } catch (err) {
      console.error("Error fetching district notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },

  /**
   * Get notifications for School role
   * - Change status of request items
   * - Supplier change status of order
   */
  getSchoolNotifications: async (schoolId: string): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch request items with status changes
      try {
        const requestsResponse = await apiClient.get(
          `/requestRequestItem/schoolRequest/${schoolId}`
        )
        const requests = Array.isArray(requestsResponse.data) ? requestsResponse.data : []

        requests.forEach((request: any) => {
          if (request.requestStatus && request.requestStatus !== "PENDING") {
            const status = request.requestStatus.toLowerCase().replace("_", " ")
            notifications.push({
              id: request.id,
              message: `Your request status changed to ${status}`,
              type: "request_status_change",
              timestamp: request.updated,
              link: `/request-food-list`,
            })
          }
        })
      } catch (err) {
        console.error("Error fetching request items:", err)
      }

      // Fetch orders with status changes from suppliers
      try {
        const trackResponse = await apiClient.get(
          `/track/current/${schoolId}`
        )
        const orders = Array.isArray(trackResponse.data) ? trackResponse.data : []

        orders.forEach((order: any) => {
          if (order.deliveryStatus && order.deliveryStatus !== "SCHEDULED") {
            const supplierName = order.supplier?.companyName || order.supplier?.names || "Supplier"
            const status = order.deliveryStatus.toLowerCase().replace("_", " ")
            notifications.push({
              id: order.id,
              message: `${supplierName} changed delivery status to ${status}`,
              type: "order_status_change",
              timestamp: order.updated,
              link: `/track-delivery`,
            })
          }
        })
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Error fetching order status changes:", err)
        }
      }
    } catch (err) {
      console.error("Error fetching school notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },

  /**
   * Get notifications for Supplier role
   * - Assign of order
   * - Notification of payment
   */
  getSupplierNotifications: async (supplierId: string): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch assigned orders
      try {
        const ordersResponse = await apiClient.get(
          `/supplierOrder/all/${supplierId}`
        )
        const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : []

        orders.forEach((order: any) => {
          // New orders assigned
          if (order.deliveryStatus === "APPROVED" || order.deliveryStatus === "SCHEDULED") {
            const districtName = order.requestItem?.district?.district || "A district"
            notifications.push({
              id: order.id,
              message: `New order assigned from ${districtName}`,
              type: "order_assigned",
              timestamp: order.created,
              link: `/supplier-orders`,
            })
          }

          // Payment notifications
          if (order.orderPayState === "PAYED") {
            notifications.push({
              id: `payment-${order.id}`,
              message: `Payment received for order #${order.id?.substring(0, 8) || "N/A"}`,
              type: "payment",
              timestamp: order.updated,
              link: `/supplier-orders`,
            })
          }
        })
      } catch (err) {
        console.error("Error fetching supplier orders:", err)
      }
    } catch (err) {
      console.error("Error fetching supplier notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },

  /**
   * Get notifications for Government role
   * - Budget status
   * - Modification complete delivery
   */
  getGovernmentNotifications: async (): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch budget status notifications
      // try {
      //   const budgetResponse = await apiClient.get(
      //     `/budget/all`
      //   )
      //   const budgets = Array.isArray(budgetResponse.data) ? budgetResponse.data : []

      //   budgets.forEach((budget: any) => {
      //     if (budget.status && budget.status !== "APPROVED") {
      //       const districtName = budget.district?.district || "A district"
      //       notifications.push({
      //         id: budget.id,
      //         message: `Budget status update for ${districtName}: ${budget.status}`,
      //         type: "budget_status",
      //         timestamp: budget.updated,
      //         link: `/gov-budget`,
      //       })
      //     }
      //   })
      // } catch (err: any) {
      //   // Silently handle 403/400 errors as these might be permission issues
      //   if (err.response?.status !== 403 && err.response?.status !== 400) {
      //     console.error("Error fetching budget status:", err)
      //   }
      // }

      // Fetch completed deliveries
      // try {
      //   const deliveriesResponse = await apiClient.get(
      //     `/supplierDelivery/all`
      //   )
      //   const deliveries = Array.isArray(deliveriesResponse.data) ? deliveriesResponse.data : []

      //   deliveries.forEach((delivery: any) => {
      //     if (delivery.deliveryStatus === "DELIVERED") {
      //       const districtName = delivery.requestItem?.district?.district || "A district"
      //       notifications.push({
      //         id: delivery.id,
      //         message: `Delivery completed for ${districtName}`,
      //         type: "delivery_complete",
      //         timestamp: delivery.updated,
      //         link: `/gov-dashboard`,
      //       })
      //     }
      //   })
      // } catch (err: any) {
      //   // Silently handle 403/400 errors
      //   if (err.response?.status !== 400 && err.response?.status !== 403) {
      //     console.error("Error fetching completed deliveries:", err)
      //   }
      // }
    } catch (err) {
      console.error("Error fetching government notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },

  /**
   * Get notifications for Admin role
   * - Notification of created account
   */
  getAdminNotifications: async (): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch recently created users
      try {
        const usersResponse = await apiClient.get(
          `/users/all`
        )
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : []

        // Get users created in the last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        users.forEach((user: any) => {
          if (user.created) {
            const createdDate = new Date(user.created)
            if (createdDate >= sevenDaysAgo) {
              const userName = user.names || user.name || "New user"
              notifications.push({
                id: user.id,
                message: `New account created: ${userName}`,
                type: "account_created",
                timestamp: user.created,
                link: `/admin-users`,
              })
            }
          }
        })
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    } catch (err) {
      console.error("Error fetching admin notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },

  /**
   * Get notifications for Stock Keeper role
   * - Stock level
   * - Order status changed by supplier
   * - Near expired item
   * - Item near to low by status
   */
  getStockKeeperNotifications: async (schoolId: string): Promise<Notification[]> => {
    const notifications: Notification[] = []

    try {
      // Fetch inventory for stock level and expiry notifications
      try {
        const inventoryResponse = await apiClient.get(
          `/inventory/all/${schoolId}`
        )
        const inventory = Array.isArray(inventoryResponse.data) ? inventoryResponse.data : []

        const now = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        inventory.forEach((item: any) => {
          // Low stock notification
          if (item.quantity && item.item?.perStudent) {
            const totalNeeded = item.item.perStudent * (item.school?.student || 0)
            const percentage = (item.quantity / totalNeeded) * 100
            if (percentage < 20) {
              notifications.push({
                id: `low-stock-${item.id}`,
                message: `Low stock alert: ${item.item?.name || "Item"} (${percentage.toFixed(0)}% remaining)`,
                type: "low_stock",
                timestamp: item.updated,
                link: `/stock-inventory`,
              })
            }
          }

          // Near expiry notification
          if (item.expiryDate) {
            const expiryDate = new Date(item.expiryDate)
            if (expiryDate <= thirtyDaysFromNow && expiryDate > now) {
              const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              notifications.push({
                id: `expiry-${item.id}`,
                message: `${item.item?.name || "Item"} expires in ${daysUntilExpiry} day(s)`,
                type: "near_expiry",
                timestamp: item.expiryDate,
                link: `/stock-inventory`,
              })
            }
          }
        })
      } catch (err) {
        console.error("Error fetching inventory:", err)
      }

      // Fetch orders with status changes from suppliers
      try {
        const receivingResponse = await apiClient.get(
          `/receiving/all/${schoolId}`
        )
        const orders = Array.isArray(receivingResponse.data) ? receivingResponse.data : []

        orders.forEach((order: any) => {
          if (order.deliveryStatus && order.deliveryStatus !== "SCHEDULED") {
            const supplierName = order.supplier?.companyName || order.supplier?.names || "Supplier"
            const status = order.deliveryStatus.toLowerCase().replace("_", " ")
            notifications.push({
              id: order.id,
              message: `${supplierName} changed order status to ${status}`,
              type: "order_status_change",
              timestamp: order.updated,
              link: `/stock-receiving`,
            })
          }
        })
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Error fetching order status changes:", err)
        }
      }
    } catch (err) {
      console.error("Error fetching stock keeper notifications:", err)
    }

    return notifications.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timeB - timeA
    })
  },
}

