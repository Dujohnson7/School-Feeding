import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { RoleKey, roleMenus } from "../shared/role-menus"

interface RoleSidebarProps {
  role: RoleKey
  onNavigate?: () => void  
}

export default function RoleSidebar({ role, onNavigate }: RoleSidebarProps) {
  const { pathname } = useLocation()
  const items = roleMenus[role]

  return (
    <div className="flex h-full w-64 flex-col bg-primary text-primary-foreground">
      <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
        <img src="/logo.svg" alt="Logo" className="h-7 w-auto" /> &nbsp;&nbsp;
        <h2 className="text-lg font-semibold"> School Feeding</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onNavigate}
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all " +
                  (isActive
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground")
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link to="/login" onClick={onNavigate}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
