
import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Check, CreditCard, Home, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ParentPayment() {
  const [selectedChild, setSelectedChild] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [submitted, setSubmitted] = useState(false)

  // Sample data
  const children = [
    { id: "child-1", name: "Kwizera Jean", grade: "Primary 3", fee: 5000 },
    { id: "child-2", name: "Uwase Marie", grade: "Primary 5", fee: 5000 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the payment here
    console.log(`Processing payment for ${selectedChild} using ${paymentMethod}`)
    setSubmitted(true)
  }

  const selectedChildData = children.find((child) => child.id === selectedChild)

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Link to="/parent-dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div className="ml-auto"></div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md py-6">
        <h1 className="mb-6 text-2xl font-bold">School Meal Payment</h1>

        {submitted ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Payment Successful</CardTitle>
              <CardDescription className="text-center">Your payment has been processed successfully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Child:</span>
                    <span>{selectedChildData?.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Grade:</span>
                    <span>{selectedChildData?.grade}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>{selectedChildData?.fee} RWF</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span>TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/parent-receipts">View Receipts</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/parent-dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Pay for your child's school meals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="child">Select Child</Label>
                  <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger id="child">
                      <SelectValue placeholder="Select a child" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.name} - {child.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedChild && (
                  <>
                    <div className="rounded-md bg-muted p-4">
                      <h3 className="mb-2 text-sm font-medium">Payment Details</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Child:</span>
                          <span>{selectedChildData?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Grade:</span>
                          <span>{selectedChildData?.grade}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Period:</span>
                          <span>April 2025</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">{selectedChildData?.fee} RWF</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="momo">MoMo</TabsTrigger>
                          <TabsTrigger value="airtel">Airtel Money</TabsTrigger>
                          <TabsTrigger value="card">Card</TabsTrigger>
                        </TabsList>
                        <TabsContent value="momo" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="momo-number">MTN Mobile Money Number</Label>
                            <Input id="momo-number" type="tel" placeholder="07X XXX XXXX" />
                          </div>
                        </TabsContent>
                        <TabsContent value="airtel" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="airtel-number">Airtel Money Number</Label>
                            <Input id="airtel-number" type="tel" placeholder="07X XXX XXXX" />
                          </div>
                        </TabsContent>
                        <TabsContent value="card" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="CVC" />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!selectedChild}>
                  Pay {selectedChildData?.fee} RWF
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="grid h-16 grid-cols-3">
          <Link
            to="/parent-dashboard"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/parent-pay" className="flex flex-col items-center justify-center gap-1 text-primary">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Pay</span>
          </Link>
          <Link
            to="/parent-receipts"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground"
          >
            <Receipt className="h-5 w-5" />
            <span className="text-xs">Receipts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
