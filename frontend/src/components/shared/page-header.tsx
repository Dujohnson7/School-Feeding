import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, LogOut, Settings, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/auth"
import { RoleKey, roleMenus } from "@/components/shared/role-menus"

interface PageHeaderProps {
  title: string
  homeTo: string
  HomeIcon: LucideIcon
  profileTo: string
  userName?: string
  userEmail?: string
  avatarSrc?: string
  avatarFallback?: string
}

export default function PageHeader({
  title,
  homeTo,
  HomeIcon,
  profileTo,
  userName: propUserName,
  userEmail: propUserEmail,
  avatarSrc: propAvatarSrc,
  avatarFallback: propAvatarFallback,
}: PageHeaderProps) {
  const navigate = useNavigate()

  // Get user info from localStorage (same as mobile header)
  const user = React.useMemo(() => {
    try {
      const userData = localStorage.getItem("user")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }, [])

  const role = React.useMemo(() => {
    try {
      const roleData = localStorage.getItem("role")
      return roleData ? (roleData.toLowerCase() as RoleKey) : null
    } catch {
      return null
    }
  }, [])

  const userName = propUserName || user?.names || user?.name || "User"
  const userEmail = propUserEmail || user?.email || ""
  const userAvatar = propAvatarSrc || user?.profile || "/userIcon.png"
  const userInitials = React.useMemo(() => {
    if (userName && userName !== "User") {
      const names = userName.split(" ")
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return userName.substring(0, 2).toUpperCase()
    }
    return propAvatarFallback || "US"
  }, [userName, propAvatarFallback])

  // Get profile URL from role menus
  const profileUrl = React.useMemo(() => {
    if (role) {
      const item = roleMenus[role]?.find((i) => i.title === "Profile")
      return item?.url ?? profileTo
    }
    return profileTo
  }, [role, profileTo])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout(navigate)
  }

  // Notifications based on role (same as mobile header)
  const notifications: string[] = React.useMemo(() => {
    if (!role) return []
    switch (role) {
      case "district":
        return [
          "Nonko Primary School requested 100kg rice",
          "Kinyinya Primary School submitted a delivery report",
          "Budget reminder: Q4 allocation review due",
        ]
      case "school":
        return [
          "Delivery ETA updated to Friday 10:00",
          "Stock report due tomorrow",
          "District approved your last request",
        ]
      case "supplier":
        return [
          "New order from Gasabo District",
          "Delivery route updated for Kicukiro",
          "Invoice #SF-2034 approved",
        ]
      case "stock":
        return [
          "Receiving scheduled today 14:00",
          "Low stock alert: Beans (20%)",
          "Distribution plan updated",
        ]
      case "government":
        return [
          "Monthly analytics report ready",
          "Budget variance exceeds 5% in 2 districts",
          "2 compliance reports pending review",
        ]
      case "admin":
      default:
        return [
          "3 new users awaiting approval",
          "System log: 2 warnings in the last hour",
          "Backup completed successfully",
        ]
    }
  }, [role])

  return (
    <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Link to={homeTo} className="lg:hidden">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications dropdown (same as mobile header) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end" forceMount>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((msg, idx) => (
                <DropdownMenuItem key={idx} className="whitespace-normal text-sm leading-snug py-2">
                  {msg}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-sm text-muted-foreground">
                No notifications
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mark all as read</DropdownMenuItem>
            <DropdownMenuItem>Notification settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile avatar dropdown (same as mobile header) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt="Avatar" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{userName}</p>
                {userEmail && (
                  <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={profileUrl}>
                <Users className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
