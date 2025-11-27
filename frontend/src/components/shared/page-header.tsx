import React from "react"
import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

import { HeaderActions } from "@/components/shared/header-actions"
import { RoleKey } from "@/components/shared/role-menus"

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
}: PageHeaderProps) {
  // Get role from localStorage
  const role = React.useMemo(() => {
    try {
      const roleData = localStorage.getItem("role")
      return roleData ? (roleData.toLowerCase() as RoleKey) : null
    } catch {
      return null
    }
  }, [])

  return (
    <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Link to={homeTo} className="lg:hidden">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <HeaderActions role={role} />
    </header>
  )
}
