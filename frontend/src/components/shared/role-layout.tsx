import React from "react"
import { PanelLeft, LogOut, Users, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import RoleSidebar from "@/components/shared/role-sidebar"
import { RoleKey, roleMenus } from "@/components/shared/role-menus"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "@/lib/auth"
import { useNotifications } from "@/hooks/use-notifications"
import { Badge } from "@/components/ui/badge"

interface RoleLayoutProps {
  role: RoleKey
  children: React.ReactNode
}

export default function RoleLayout({ role, children }: RoleLayoutProps) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const profileUrl = React.useMemo(() => {
    const item = roleMenus[role]?.find((i) => i.title === "Profile")
    return item?.url ?? "/profile"
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

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout(navigate)
  }

  // Use notification hook to fetch real notifications
  const { notifications, unreadCount } = useNotifications(role)

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <RoleSidebar role={role} />
      </div>
  
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden"> 
        <header className="md:hidden flex h-12 items-center gap-1.5 border-b border-accent-foreground/10 bg-accent text-accent-foreground px-2 sm:px-3 shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setOpen(true)}>
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Open Menu</span>
          </Button>
 
          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="flex items-center gap-1">
              <img src="/logo.svg" alt="Logo" className="h-4 w-auto" />
              <span className="text-xs sm:text-sm font-medium truncate">School Feeding</span>
            </div>
          </div>
 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full shrink-0 relative">
                <Bell className="h-3.5 w-3.5" />
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 w-7 rounded-full shrink-0">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={userAvatar} alt="Avatar" />
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
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
        </header>

        {/* Page content  */}
        <div className="flex-1 min-w-0 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <RoleSidebar role={role} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
