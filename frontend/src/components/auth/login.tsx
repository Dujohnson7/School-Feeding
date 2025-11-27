import type React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

const loginImage = "/images/image01.jpg"
const logoImage = "/logo.svg"

export function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setLoginData((prev) => ({ ...prev, [field]: value }))
  }

  const getDashboardPathForRole = (roleRaw: string | undefined | null): string => {
    if (!roleRaw) return "/" 
    const role = roleRaw.trim().toUpperCase().replace(/^ROLE_/, "")
    switch (role) {
      case "ADMIN":
      case "ADMINISTRATOR":
        return "/admin-dashboard"
      case "GOV":
      case "GOVERNMENT":
        return "/gov-dashboard"
      case "DISTRICT":
        return "/district-dashboard"
      case "SCHOOL":
        return "/school-dashboard"
      case "SUPPLIER":
        return "/supplier-dashboard"
      case "STOCK_KEEPER":
      case "STOCKKEEPER":
        return "/stock-dashboard"
      default: 
        return "/login"
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })
 
      let data: any = null
      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch { 
        }
      }
 
      if (!response.ok || data?.error || data?.status === "error") {
        const message =
          data?.message ||
          data?.error ||
          response.statusText ||
          "Invalid credentials."
        throw new Error(message)
      }
      
      const token = data?.token
      const roleFromApi = data?.role
      if (!token || !roleFromApi) {
        throw new Error("Malformed login response: missing token or role.")
      }
  
      localStorage.setItem("token", token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data?.id ?? null,
          names: data?.names ?? null,
          email: data?.email ?? null,
          phone: data?.phone ?? null,
          role: roleFromApi,
          district: data?.district ?? null,
          school: data?.school ?? null,
        }),
      )
      localStorage.setItem("userId", data?.id || "")
      localStorage.setItem("role", roleFromApi || "")
      localStorage.setItem("districtId", data?.district?.id || "")
      localStorage.setItem("schoolId", data?.school?.id || "")

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data?.names || "User"}!`,
      })

      const targetPath = getDashboardPathForRole(roleFromApi)
      navigate(targetPath, { replace: true })
    } catch (error: any) {
      setErrorMessage(error?.message || "Something went wrong. Please try again.")
      toast({
        title: "Login Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left image section */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-2/5 bg-blue-600">
        <div className="w-full h-full relative">
          <Link to="/">
            <img
              src={loginImage}
              alt="School Children"
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-600/60 flex flex-col justify-end p-8 lg:p-12">
            <Link to="/" className="text-white hover:text-blue-100 transition-colors">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">School Feeding Program</h1>
              <p className="text-lg lg:text-xl text-blue-100">
                Nourishing young minds for a brighter future through healthy meals and quality education.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <img
                  src={logoImage}
                  alt="School Feeding Logo"
                  className="h-12 w-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
                <h2 className="text-3xl font-bold text-gray-900">School Feeding</h2>
              </div>
              <p className="text-gray-600">Digital School Management Platform</p>
            </div>
          </div>

          <Card className="border border-blue-100 shadow-lg w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={loginData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {errorMessage ? (
                  <div className="text-sm text-red-600">
                    {errorMessage}
                  </div>
                ) : null}

                <hr />
                <div className="text-center text-sm text-gray-600">
                  Don’t have an account?{" "}
                  <a href="mailto:schoolfeeding.info@gmail.com" className="text-blue-600 hover:underline">
                    Contact Administrator
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} School Feeding Program. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}