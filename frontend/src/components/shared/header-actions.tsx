import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, LogOut, Users } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { logout } from "@/lib/auth"
import { RoleKey, roleMenus } from "@/components/shared/role-menus"
import { useNotifications } from "@/hooks/use-notifications"

interface HeaderActionsProps {
  role?: RoleKey | null
  className?: string
}

/**
 * Shared header actions component for notifications and user dropdown
 * Can be used in both mobile and desktop headers
 */
export function HeaderActions({ role, className = "" }: HeaderActionsProps) {
  const navigate = useNavigate()

  // Get role from localStorage if not provided
  const currentRole = React.useMemo(() => {
    if (role) return role
    try {
      const roleData = localStorage.getItem("role")
      return roleData ? (roleData.toLowerCase() as RoleKey) : null
    } catch {
      return null
    }
  }, [role])

  // Get user info from localStorage
  const user = React.useMemo(() => {
    try {
      const userData = localStorage.getItem("user")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }, [])

  const userName = user?.names || user?.name || "User"
  const userEmail = user?.email || ""
  const userAvatar = user?.profile 
    ? `http://localhost:8070/uploads/${user.profile}` 
    : "/userIcon.png"
  const userInitials = React.useMemo(() => {
    if (userName && userName !== "User") {
      const names = userName.split(" ")
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return userName.substring(0, 2).toUpperCase()
    }
    return "US"
  }, [userName])

  // Get profile URL from role menus
  const profileUrl = React.useMemo(() => {
    if (currentRole) {
      const item = roleMenus[currentRole]?.find((i) => i.title === "Profile")
      return item?.url ?? "/profile"
    }
    return "/profile"
  }, [currentRole])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout(navigate)
  }

  // Use notification hook to fetch real notifications
  const { notifications, unreadCount } = useNotifications(currentRole)

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Notifications dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <DropdownMenuLabel>
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length > 0 ? (
            notifications.slice(0, 10).map((notification, idx) => (
              <DropdownMenuItem
                key={notification.id || idx}
                className="whitespace-normal text-sm leading-snug py-2"
                asChild
              >
                {notification.link ? (
                  <Link to={notification.link} className="flex flex-col">
                    <span>{notification.message}</span>
                    {notification.timestamp && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="flex flex-col">
                    <span>{notification.message}</span>
                    {notification.timestamp && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
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

      {/* Profile avatar dropdown */}
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
  )
}

