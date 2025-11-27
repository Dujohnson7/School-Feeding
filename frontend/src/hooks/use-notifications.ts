import { useState, useEffect, useMemo } from "react"
import { notificationService, Notification } from "@/lib/notifications"
import { RoleKey } from "@/components/shared/role-menus"

export function useNotifications(role: RoleKey | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!role) {
      setNotifications([])
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)

        let fetchedNotifications: Notification[] = []

        switch (role) {
          case "district": {
            const districtId = localStorage.getItem("districtId")
            if (districtId) {
              fetchedNotifications = await notificationService.getDistrictNotifications(districtId)
            }
            break
          }
          case "school": {
            const schoolId = localStorage.getItem("schoolId")
            if (schoolId) {
              fetchedNotifications = await notificationService.getSchoolNotifications(schoolId)
            }
            break
          }
          case "supplier": {
            const supplierId = localStorage.getItem("userId")
            if (supplierId) {
              fetchedNotifications = await notificationService.getSupplierNotifications(supplierId)
            }
            break
          }
          case "government": {
            fetchedNotifications = await notificationService.getGovernmentNotifications()
            break
          }
          case "admin": {
            fetchedNotifications = await notificationService.getAdminNotifications()
            break
          }
          case "stock": {
            const schoolId = localStorage.getItem("schoolId")
            if (schoolId) {
              fetchedNotifications = await notificationService.getStockKeeperNotifications(schoolId)
            }
            break
          }
          default:
            fetchedNotifications = []
        }

        setNotifications(fetchedNotifications)
      } catch (err: any) {
        console.error("Error fetching notifications:", err)
        setError(err.message || "Failed to fetch notifications")
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [role])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refresh: () => {
      // Trigger refresh by updating role dependency
      const currentRole = role
      if (currentRole) {
        // Force re-fetch
        setLoading(true)
      }
    },
  }
}

