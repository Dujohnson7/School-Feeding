import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import {  BarChart3,  Building2,  ChevronDown,  FileText,  Heart,  Home,  Package,  Settings,  Truck,  Users,  Warehouse,  CreditCard,  Receipt,  ClipboardList,  UserCheck,  Shield,  LogOut,  User, } from "lucide-react"

import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem,SidebarRail, } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 
const menuItems = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: Home,
    },
    {
      title: "User Management",
      url: "/admin-users",
      icon: Users,
    },
    {
      title: "Audit Logs",
      url: "/admin-logs",
      icon: Shield,
    },
    {
      title: "Settings",
      url: "/admin-settings",
      icon: Settings,
    },
  ],
  government: [
    {
      title: "Dashboard",
      url: "/gov-dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      url: "/gov-analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      url: "/gov-reports",
      icon: FileText,
    },
  ],
  district: [
    {
      title: "Dashboard",
      url: "/district-dashboard",
      icon: Home,
    },
    {
      title: "School Approvals",
      url: "/district-approvals",
      icon: ClipboardList,
    },
    {
      title: "Manage Suppliers",
      url: "/manage-suppliers",
      icon: Truck,
    },
    {
      title: "Add Supplier",
      url: "/add-supplier",
      icon: Building2,
    },
    {
      title: "Reports",
      url: "/district-reports",
      icon: FileText,
    },
  ],
  school: [
    {
      title: "Dashboard",
      url: "/school-dashboard",
      icon: Home,
    },
    {
      title: "Request Food",
      url: "/request-food",
      icon: Package,
    },
    {
      title: "Track Delivery",
      url: "/track-delivery",
      icon: Truck,
    },
    {
      title: "Stock Managers",
      url: "/manage-stock-managers",
      icon: UserCheck,
    },
    {
      title: "Reports",
      url: "/school-reports",
      icon: FileText,
    },
  ],
  supplier: [
    {
      title: "Dashboard",
      url: "/supplier-dashboard",
      icon: Home,
    },
    {
      title: "Orders",
      url: "/supplier-orders",
      icon: ClipboardList,
    },
    {
      title: "Deliveries",
      url: "/supplier-deliveries",
      icon: Truck,
    },
    {
      title: "Reports",
      url: "/supplier-reports",
      icon: FileText,
    },
  ],
  stock: [
    {
      title: "Dashboard",
      url: "/stock-dashboard",
      icon: Home,
    },
    {
      title: "Inventory",
      url: "/stock-inventory",
      icon: Package,
    },
    {
      title: "Receiving",
      url: "/stock-receiving",
      icon: Warehouse,
    },
    {
      title: "Distribution",
      url: "/stock-distribution",
      icon: Truck,
    },
    {
      title: "Reports",
      url: "/stock-reports",
      icon: FileText,
    },
  ], 
}

interface AppSidebarProps {
  userRole?: keyof typeof menuItems
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function AppSidebar({
  userRole = "school",
  userName = "John Doe",
  userEmail = "john@school.edu",
  userAvatar,
}: AppSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const currentMenuItems = menuItems[userRole] || menuItems.school

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sidebar-primary-foreground">
                  <Heart className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">School Feeding</span>
                  <span className="truncate text-xs capitalize">{userRole} Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
