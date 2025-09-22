
import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Check, Home, LogOut, Package, Plus, Settings, Truck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export function AddSupplier() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    tinNumber: "",
    bankAccount: "",
    bankName: "",
    supplierType: "",
    description: "",
    certifications: [] as string[],
  })

  const supplierTypes = [
    "Food Supplier",
    "Dairy Products",
    "Meat & Poultry",
    "Vegetables & Fruits",
    "Grains & Cereals",
    "Beverages",
    "Packaged Foods",
  ]

  const certificationOptions = [
    "ISO 22000 (Food Safety)",
    "HACCP Certification",
    "Organic Certification",
    "Halal Certification",
    "Fair Trade Certification",
    "Local Business License",
    "Tax Compliance Certificate",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCertificationChange = (certification: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      certifications: checked
        ? [...prev.certifications, certification]
        : prev.certifications.filter((c) => c !== certification),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Supplier data:", formData)
    toast({
      title: "Supplier Added Successfully",
      description: "The new supplier has been registered and is pending approval.",
    })
    // Reset form
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      tinNumber: "",
      bankAccount: "",
      bankName: "",
      supplierType: "",
      description: "",
      certifications: [],
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">District Coordinator</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/district-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/district-approvals"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Check className="h-4 w-4" />
              Approvals
            </Link>
            <Link
              to="/manage-suppliers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Truck className="h-4 w-4" />
              Suppliers
            </Link>
            <Link
              to="/add-supplier"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Supplier
            </Link>
            <Link
              to="/district-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/district-settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link href="#" className="lg:hidden">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Add New Supplier</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">District Coordinator</p>
                    <p className="text-xs leading-none text-muted-foreground">coordinator@district.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Registration</CardTitle>
                <CardDescription>
                  Register a new supplier for the school feeding program. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          placeholder="Enter company name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplierType">Supplier Type *</Label>
                        <Select
                          value={formData.supplierType}
                          onValueChange={(value) => handleInputChange("supplierType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier type" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tinNumber">TIN Number *</Label>
                        <Input
                          id="tinNumber"
                          value={formData.tinNumber}
                          onChange={(e) => handleInputChange("tinNumber", e.target.value)}
                          placeholder="Enter TIN number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Business Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter business address"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Brief description of the company and services"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          placeholder="Enter contact person name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Banking Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name *</Label>
                        <Select
                          value={formData.bankName}
                          onValueChange={(value) => handleInputChange("bankName", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank-of-kigali">Bank of Kigali</SelectItem>
                            <SelectItem value="equity-bank">Equity Bank</SelectItem>
                            <SelectItem value="gt-bank">GT Bank</SelectItem>
                            <SelectItem value="cogebanque">Cogebanque</SelectItem>
                            <SelectItem value="urwego-bank">Urwego Bank</SelectItem>
                            <SelectItem value="access-bank">Access Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Bank Account Number *</Label>
                        <Input
                          id="bankAccount"
                          value={formData.bankAccount}
                          onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                          placeholder="Enter bank account number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Certifications & Licenses</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {certificationOptions.map((certification) => (
                        <div key={certification} className="flex items-center space-x-2">
                          <Checkbox
                            id={certification}
                            checked={formData.certifications.includes(certification)}
                            onCheckedChange={(checked) => handleCertificationChange(certification, checked as boolean)}
                          />
                          <Label htmlFor={certification} className="text-sm">
                            {certification}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1">
                      Register Supplier
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 bg-transparent">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddSupplier
