import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Check, Send, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const otpImage = "/images/image01.jpg"
const logoImage = "/logo.svg"

type OtpPurpose = "login" | "forgot-password"

const PURPOSE_COPY: Record<OtpPurpose, { title: string; description: string; successMessage: string }> = {
  login: {
    title: "Verify Your Login",
    description: "Enter the verification code sent to your email to continue signing in.",
    successMessage: "Login verified successfully.",
  },
  "forgot-password": {
    title: "Verify Your OTP",
    description: "Enter the code sent to your email to reset your password.",
    successMessage: "OTP verified successfully.",
  },
}

export function OTPVerification() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const purpose = useMemo<OtpPurpose>(() => {
    const raw = (searchParams.get("purpose") || "").toLowerCase()
    return raw === "forgot-password" ? "forgot-password" : "login"
  }, [searchParams])

  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "We could not identify the associated email. Please start the process again.",
        variant: "destructive",
      })
      navigate(purpose === "login" ? "/login" : "/forgot-password", { replace: true })
    }
  }, [email, navigate, purpose])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    if (!otp || otp.length < 4) {
      setErrorMessage("Please enter the 6 digit code sent to your email.")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch("http://localhost:8070/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          purpose,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || data?.status === "error") {
        const message = data?.message || response.statusText || "Invalid or expired OTP."
        throw new Error(message)
      }

      setSuccess(true)
      toast({
        title: "OTP Verified",
        description: PURPOSE_COPY[purpose].successMessage,
      })

      if (purpose === "login") {
        const token = data?.token
        const role = data?.role

        if (token && role) {
          localStorage.setItem("token", token)
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data?.id ?? null,
              names: data?.names ?? null,
              email: data?.email ?? email,
              phone: data?.phone ?? null,
              role,
              district: data?.district ?? null,
              school: data?.school ?? null,
            }),
          )
          localStorage.setItem("role", role || "")
          localStorage.setItem("districtId", data?.district?.id || "")
          localStorage.setItem("schoolId", data?.school?.id || "")

          const normalizedRole = (role as string).trim().toUpperCase().replace(/^ROLE_/, "")

          const redirectMap: Record<string, string> = {
            ADMIN: "/admin-dashboard",
            ADMINISTRATOR: "/admin-dashboard",
            GOV: "/gov-dashboard",
            GOVERNMENT: "/gov-dashboard",
            DISTRICT: "/district-dashboard",
            SCHOOL: "/school-dashboard",
            SUPPLIER: "/supplier-dashboard",
            STOCK_KEEPER: "/stock-dashboard",
            STOCKKEEPER: "/stock-dashboard",
          }

          const targetPath = redirectMap[normalizedRole] ?? "/login"
          navigate(targetPath, { replace: true })
          return
        }

        navigate("/login", { replace: true })
        return
      }

      const resetToken = data?.resetToken || data?.token || searchParams.get("token") || ""
      if (resetToken) {
        navigate(`/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`, {
          replace: true,
        })
      } else {
        navigate("/reset-password", { replace: true })
      }
    } catch (error: any) {
      const message = error?.message || "Failed to verify code. Please try again."
      setErrorMessage(message)
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResending(true)

    try {
      const response = await fetch("http://localhost:8070/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || data?.status === "error") {
        const message = data?.message || response.statusText || "Failed to resend code."
        throw new Error(message)
      }

      toast({
        title: "OTP Sent",
        description: `A new verification code has been sent to ${email}.`,
      })
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error?.message || "Unable to resend code. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left image section */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-2/5 bg-blue-600">
        <div className="w-full h-full relative">
          <Link to="/">
            <img
              src={otpImage}
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

      {/* OTP form */}
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
              <CardTitle className="text-gray-900">{PURPOSE_COPY[purpose].title}</CardTitle>
              <CardDescription>{PURPOSE_COPY[purpose].description}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6 digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="tracking-widest text-lg text-center"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !otp}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>

                {errorMessage ? (
                  <div className="text-sm text-red-600 text-left">
                    {errorMessage}
                  </div>
                ) : null}

                {success ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    Code verified successfully.
                  </div>
                ) : null}
              </form>

              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                    {resending ? "Sending..." : "Resend"}
                  </button>
                </p>

                <p className="text-sm text-gray-600">
                  Verifying for the wrong account?{" "}
                  <Link
                    to={purpose === "login" ? "/login" : "/forgot-password"}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Start over
                  </Link>
                </p>
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

