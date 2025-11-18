import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const location = useLocation()
  const isBrowser = typeof window !== "undefined"
  const token = isBrowser ? window.localStorage.getItem("token") : null

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return <>{children}</>
}


