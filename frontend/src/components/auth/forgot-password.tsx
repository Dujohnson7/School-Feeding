import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { authService } from "./service/authService"

const loginImage = "/images/image01.jpg"
const logoImage = "/logo.svg"

export function ForgotPassword() {
  const [step, setStep] = useState<"request" | "sent">("request")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resetData, setResetData] = useState({
    email: "",
  })

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      await authService.forgotPassword(resetData.email)

      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      })
      setStep("sent")
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

  const handleInputChange = (field: string, value: string) => {
    setResetData((prev) => ({ ...prev, [field]: value }))
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
            {step === "request" ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-gray-900">Forgot Password?</CardTitle>
                  <CardDescription>Enter your email to receive a reset link</CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleResetRequest} className="space-y-4">
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
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </Button>

                    {errorMessage ? (
                      <div className="text-sm text-red-600 text-left">
                        {errorMessage}
                      </div>
                    ) : null}
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-gray-900">Check Your Email</CardTitle>
                  <CardDescription>
                    We've sent an OTP to <strong>{resetData.email}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
                      <h4 className="text-sm font-medium mb-2 text-blue-900">Next Steps:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check your email inbox for the verification OTP</li>
                        <li>• The OTP will expire in 10 minutes</li>
                      </ul>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/reset-password?email=${encodeURIComponent(resetData.email)}`}
                        className="w-full"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Reset Password
                        </Button>
                      </Link>
                      <Link to="/login" className="w-full">
                        <Button className="w-full bg-gray-600 hover:bg-gray-700">Back to Login</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} School Feeding Program. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
