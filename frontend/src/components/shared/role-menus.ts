import { Home, Users, FileText, Settings, Truck, Building2, ClipboardList, Package, Warehouse, BarChart3, Shield } from "lucide-react"

export type RoleKey = "admin" | "district" | "government" | "school" | "stock" | "supplier"

export const roleHeaders: Record<RoleKey, string> = {
  admin: "System Administration",
  district: "District Administration",
  government: "Government Portal",
  school: "School Portal",
  stock: "Stock Management",
  supplier: "Supplier Portal",
}

export const roleDashIcons: Record<RoleKey, any> = {
  admin: Shield,
  district: Building2,
  government: Shield,
  school: Home,
  stock: Warehouse,
  supplier: Truck,
}

export const roleMenus: Record<RoleKey, { title: string; url: string; icon: any }[]> = {
  admin: [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "User Management", url: "/admin-users", icon: Users },
    { title: "Audit Logs", url: "/admin-logs", icon: FileText },
    { title: "System Settings", url: "/admin-settings", icon: Settings },
    { title: "Profile", url: "/admin-profile", icon: Settings },
  ],
  district: [
    { title: "Dashboard", url: "/district-dashboard", icon: Home },
    { title: "School Approvals", url: "/district-approvals", icon: ClipboardList }, 
    { title: "Manage Suppliers", url: "/manage-suppliers", icon: Truck },
    { title: "Budget", url: "/district-budget", icon: FileText },
    { title: "Reports", url: "/district-reports", icon: FileText },
    { title: "Profile", url: "/district-profile", icon: Settings },
  ],
  government: [
    { title: "Dashboard", url: "/gov-dashboard", icon: Home },
    { title: "Analytics", url: "/gov-analytics", icon: BarChart3 },
    { title: "Budget", url: "/gov-budget", icon: FileText },
    { title: "Reports", url: "/gov-reports", icon: FileText },
    { title: "Profile", url: "/gov-profile", icon: Settings },
  ],
  school: [
    { title: "Dashboard", url: "/school-dashboard", icon: Home },
    { title: "Request Food", url: "/request-food", icon: Package },
    { title: "Track Delivery", url: "/track-delivery", icon: Truck },
    { title: "Stock Managers", url: "/manage-stock-managers", icon: Users },
    { title: "Reports", url: "/school-reports", icon: FileText },
    { title: "Profile", url: "/school-profile", icon: Settings },
  ],
  stock: [
    { title: "Dashboard", url: "/stock-dashboard", icon: Home },
    { title: "Inventory", url: "/stock-inventory", icon: Package },
    { title: "Receiving", url: "/stock-receiving", icon: Warehouse },
    { title: "Distribution", url: "/stock-distribution", icon: Truck },
    { title: "Reports", url: "/stock-reports", icon: FileText },
    { title: "Profile", url: "/stock-profile", icon: Settings },
  ],
  supplier: [
    { title: "Dashboard", url: "/supplier-dashboard", icon: Home },
    { title: "Orders", url: "/supplier-orders", icon: ClipboardList },
    { title: "Deliveries", url: "/supplier-deliveries", icon: Truck },
    { title: "Reports", url: "/supplier-reports", icon: FileText },
    { title: "Profile", url: "/supplier-profile", icon: Settings },
  ],
}
