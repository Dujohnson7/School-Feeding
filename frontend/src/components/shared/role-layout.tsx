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
  const userAvatar = user?.profile || "/userIcon.png"
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

  const notifications: string[] = React.useMemo(() => {
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
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full shrink-0">
                <Bell className="h-3.5 w-3.5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((msg, idx) => (
                <DropdownMenuItem key={idx} className="whitespace-normal text-sm leading-snug py-2">
                  {msg}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Notification settings</DropdownMenuItem>
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
