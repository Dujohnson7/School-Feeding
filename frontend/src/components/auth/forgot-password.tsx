import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, User, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function ForgotPassword() {
  const [step, setStep] = useState<"request" | "sent">("request")
  const [resetData, setResetData] = useState({
    email: "",
    role: "",
  })

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset request:", resetData)

    if (resetData.email ) {
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      })
      setStep("sent")
    } else {
      toast({
        title: "Error",
        description: "Please fill email in fields.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setResetData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md space-y-6 z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-2"> 
          <h1 className="text-2xl font-bold text-white">School Feeding</h1>
          <p className="text-blue-100">Reset your password</p>
        </div>

        {/* Reset Form */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          {step === "request" ? (
            <>
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">Forgot Password?</CardTitle>
                <br />
                <CardDescription>
                  Enter your email address, and we'll send you a link to reset your password.
                </CardDescription>
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

                  {/* Submit Button */}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Reset Link
                  </Button>
                </form>

                {/* Back to Login */}
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
                  We've sent a password reset link to <strong>{resetData.email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium mb-2 text-blue-900">Next Steps:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Check your email inbox for the reset link</li>
                      <li>• Click the link to create a new password</li>
                      <li>• The link will expire in 24 hours</li>
                      <li>• Check your spam folder if you don't see the email</li>
                    </ul>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => setStep("request")} variant="outline" className="w-full">
                      Try Different Email
                    </Button>
                    <Link to="/login" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-blue-100">
          <p>© 2025 School Feeding. All rights reserved.</p> 
        </div>
      </div>
    </div>
  )
}
