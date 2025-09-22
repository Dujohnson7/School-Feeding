
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CreditCard, Download, FileText, Home, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReceiptData {
  id: string
  date: string
  amount: number
  child: string
  grade: string
  status: "paid" | "pending" | "failed"
  period: string
  paymentMethod: string
}

export function ParentReceipts() {
  const [selectedChild, setSelectedChild] = useState("all")

  // Sample data
  const children = [
    { id: "child-1", name: "Kwizera Jean", grade: "Primary 3" },
    { id: "child-2", name: "Uwase Marie", grade: "Primary 5" },
  ]

  const receipts: ReceiptData[] = [
    {
      id: "REC-2025-042",
      date: "Apr 7, 2025",
      amount: 5000,
      child: "child-1",
      grade: "Primary 3",
      status: "paid",
      period: "April 2025",
      paymentMethod: "MoMo",
    },
    {
      id: "REC-2025-038",
      date: "Mar 5, 2025",
      amount: 5000,
      child: "child-1",
      grade: "Primary 3",
      status: "paid",
      period: "March 2025",
      paymentMethod: "Airtel Money",
    },
    {
      id: "REC-2025-041",
      date: "Apr 6, 2025",
      amount: 5000,
      child: "child-2",
      grade: "Primary 5",
      status: "paid",
      period: "April 2025",
      paymentMethod: "Card",
    },
    {
      id: "REC-2025-037",
      date: "Mar 4, 2025",
      amount: 5000,
      child: "child-2",
      grade: "Primary 5",
      status: "paid",
      period: "March 2025",
      paymentMethod: "MoMo",
    },
    {
      id: "REC-2025-043",
      date: "May 1, 2025",
      amount: 5000,
      child: "child-1",
      grade: "Primary 3",
      status: "pending",
      period: "May 2025",
      paymentMethod: "MoMo",
    },
  ]

  // Filter receipts based on selected child
  const filteredReceipts = receipts
    .filter((receipt) => selectedChild === "all" || receipt.child === selectedChild)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleDownloadPDF = (receiptId: string) => {
    // In a real app, this would generate and download a PDF receipt
    console.log(`Downloading PDF for receipt ${receiptId}`)
    alert(`Receipt ${receiptId} would be downloaded as PDF in a real application`)
  }

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
        <h1 className="mb-6 text-2xl font-bold">Payment Receipts</h1>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Receipts</CardTitle>
            <CardDescription>View and download your payment receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by child" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} - {child.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredReceipts.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredReceipts.map((receipt) => {
                  const childName = children.find((c) => c.id === receipt.child)?.name || "Unknown"

                  return (
                    <AccordionItem key={receipt.id} value={receipt.id}>
                      <AccordionTrigger className="py-3">
                        <div className="flex w-full items-center justify-between pr-4">
                          <div className="text-left">
                            <p className="font-medium">{receipt.period}</p>
                            <p className="text-sm text-muted-foreground">{childName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{receipt.amount} RWF</span>
                            {getStatusBadge(receipt.status)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="rounded-md bg-muted p-3">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Receipt ID:</span>
                                <span>{receipt.id}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{receipt.date}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Child:</span>
                                <span>{childName}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Grade:</span>
                                <span>{receipt.grade}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Period:</span>
                                <span>{receipt.period}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Amount:</span>
                                <span>{receipt.amount} RWF</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span>{receipt.paymentMethod}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span>{getStatusBadge(receipt.status)}</span>
                              </div>
                            </div>
                          </div>

                          {receipt.status === "paid" && (
                            <Button variant="outline" className="w-full" onClick={() => handleDownloadPDF(receipt.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          )}

                          {receipt.status === "pending" && (
                            <Button asChild className="w-full">
                              <Link to="/parent-pay">Complete Payment</Link>
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No receipts found.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
          <Link to="/parent-pay" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Pay</span>
          </Link>
          <Link to="/parent-receipts" className="flex flex-col items-center justify-center gap-1 text-primary">
            <Receipt className="h-5 w-5" />
            <span className="text-xs">Receipts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
