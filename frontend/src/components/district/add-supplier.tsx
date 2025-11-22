
import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bell, Check, Home, LogOut, Package, Plus, Settings, Truck, User } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
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

interface Item {
  id: string
  name: string
  category?: string
}

const API_BASE_URL = "http://localhost:8070/api"

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
    description: "",
    items: [] as string[],
  })

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingItems, setLoadingItems] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true)
        const response = await axios.get(`${API_BASE_URL}/items/all`)
        setItems(response.data || [])
      } catch (err: any) {
        console.error("Error fetching items:", err)
        toast.error("Failed to load items")
      } finally {
        setLoadingItems(false)
      }
    }

    fetchItems()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (itemId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      items: checked
        ? [...prev.items, itemId]
        : prev.items.filter((id) => id !== itemId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.companyName || !formData.email || !formData.phone || !formData.address || 
        !formData.tinNumber || !formData.bankName || !formData.bankAccount) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.items.length === 0) {
      toast.error("Please select at least one item")
      return
    }

    try {
      setLoading(true)
      const districtId = localStorage.getItem("districtId")
      
      const supplierPayload = {
        companyName: formData.companyName,
        tinNumber: formData.tinNumber,
        address: formData.address,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        district: districtId ? { id: districtId } : null,
        items: formData.items.map(itemId => ({ id: itemId })),
        // Additional fields if needed by backend
        email: formData.email,
        phone: formData.phone,
        contactPerson: formData.contactPerson,
        description: formData.description,
      }

      const response = await axios.post(`${API_BASE_URL}/supplier/register`, supplierPayload)
      
      toast.success("Supplier registered successfully")
      
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
        description: "",
        items: [],
      })
      
      // Navigate back to supplier management
      navigate("/manage-suppliers")
    } catch (err: any) {
      console.error("Error registering supplier:", err)
      const errorMessage = err.response?.data || "Failed to register supplier"
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to register supplier")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
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

                  {/* Items Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Items *</h3>
                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                      {loadingItems ? (
                        <p className="text-sm text-muted-foreground">Loading items...</p>
                      ) : items.length > 0 ? (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={formData.items.includes(item.id)}
                                onCheckedChange={(checked) => handleItemChange(item.id, checked === true)}
                              />
                              <label
                                htmlFor={`item-${item.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {item.name} {item.category && `(${item.category})`}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No items available</p>
                      )}
                    </div>
                    {formData.items.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {formData.items.length} item(s) selected
                      </p>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Registering..." : "Register Supplier"}
                    </Button> 
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => navigate("/manage-suppliers")}
                      disabled={loading}
                    >
                      Cancel
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
