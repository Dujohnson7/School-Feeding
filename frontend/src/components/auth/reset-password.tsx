import type React from "react"

import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { authService } from "./service/authService"

const resetImage = "/images/image01.jpg"
const logoImage = "/logo.svg"

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get("email") || ""

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resetData, setResetData] = useState({
    email: initialEmail,
    otp: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const nextEmail = searchParams.get("email") || ""
    setResetData((prev) => ({
      ...prev,
      email: nextEmail || prev.email,
    }))
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setResetData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!resetData.email) {
      setErrorMessage("Email is required.")
      return
    }

    if (!resetData.otp || resetData.otp.length < 4) {
      setErrorMessage("Please enter the OTP sent to your email.")
      return
    }

    if (!resetData.password || resetData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return
    }

    if (resetData.password !== resetData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword({
        email: resetData.email,
        otp: resetData.otp,
        password: resetData.password,
      })

      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      })

      navigate("/login", { replace: true })
    } catch (error: any) {
      const message = error?.message || "Something went wrong. Please try again."
      setErrorMessage(message)
      toast({
        title: "Reset Failed",
        description: message,
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
              src={resetImage}
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

      {/* Reset form */}
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
              <CardTitle className="text-gray-900">Reset Password</CardTitle>
              <CardDescription>Enter the OTP and choose a new password</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={resetData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                {/* OTP */}
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter the OTP sent to your email"
                      className="pl-10"
                      value={resetData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                      value={resetData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10"
                      value={resetData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>

                {errorMessage ? (
                  <div className="text-sm text-red-600 text-left">
                    {errorMessage}
                  </div>
                ) : null}
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  Back to Login
                </Link>
              </div>
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

