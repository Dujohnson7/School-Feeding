import React from "react"
import { PanelLeft, LogOut, Users, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import RoleSidebar from "@/components/shared/role-sidebar"
import { RoleKey, roleMenus } from "@/components/shared/role-menus"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

interface RoleLayoutProps {
  role: RoleKey
  children: React.ReactNode
}

export default function RoleLayout({ role, children }: RoleLayoutProps) {
  const [open, setOpen] = React.useState(false)
  const profileUrl = React.useMemo(() => {
    const item = roleMenus[role]?.find((i) => i.title === "Profile")
    return item?.url ?? "/profile"
  }, [role])

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
      <div className="flex flex-1 flex-col"> 
        <header className="md:hidden flex h-14 items-center gap-4 border-b border-accent-foreground/10 bg-accent text-accent-foreground px-4 lg:px-6">
    
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Open Menu</span>
          </Button>
 
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="h-6 w-auto" />
              <span className="text-base font-semibold">School Feeding</span>
            </div>
          </div>
 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Bell className="h-5 w-5" />
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/userIcon.png" alt="Avatar" /> 
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link to={profileUrl}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content  */}
        <div className="p-0">
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
