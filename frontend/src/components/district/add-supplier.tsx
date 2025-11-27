
import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Check, Home, Package, Plus, Truck } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderActions } from "@/components/shared/header-actions"
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
    password: "",
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
        const response = await axios.get(`${API_BASE_URL}/item/all`)
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
    if (!formData.companyName || !formData.email || !formData.phone || !formData.password || 
        !formData.address || !formData.tinNumber || !formData.bankName || !formData.bankAccount || !formData.contactPerson) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate TIN Number is a valid number
    if (!formData.tinNumber || formData.tinNumber.trim() === "") {
      toast.error("TIN Number is required")
      return
    }

    if (formData.items.length === 0) {
      toast.error("Please select at least one item")
      return
    }

    try {
      setLoading(true)
      const districtId = localStorage.getItem("districtId")
      
      if (!districtId) {
        toast.error("District ID not found. Please log in again.")
        setLoading(false)
        return
      }
      
      // Map bank name from kebab-case to display format (matching admin pattern)
      const mapBankName = (bankName: string): string => {
        const bankMap: Record<string, string> = {
          "bank-of-kigali": "Bank of Kigali",
          "equity-bank": "Equity Bank",
          "gt-bank": "GT Bank",
          "cogebanque": "Cogebanque",
          "urwego-bank": "Urwego Bank",
          "access-bank": "Access Bank",
        }
        return bankMap[bankName] || bankName
      }
      
      const supplierPayload = {
        // Users fields (inherited from Users entity)
        names: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "SUPPLIER",
        district: { id: districtId },
        userStatus: true,
        // Supplier-specific fields
        companyName: formData.companyName,
        tinNumber: formData.tinNumber,
        address: formData.address,
        bankName: mapBankName(formData.bankName),
        bankAccount: formData.bankAccount,
        items: formData.items.map(itemId => ({ id: itemId }))
      }

      const response = await axios.post(`${API_BASE_URL}/supplier/register`, supplierPayload)
      
      toast.success("Supplier registered successfully")
      
      // Reset form
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        password: "",
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
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/district-dashboard" className="lg:hidden">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Add New Supplier</h1>
          </div>
          <HeaderActions role="district" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
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
                          maxLength={255}
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
                          maxLength={50}
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
                          maxLength={255}
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
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.description.length}/500 characters
                      </p>
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
                          maxLength={255}
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
                          maxLength={20}
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
                          maxLength={255}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Enter password (min 6 characters)"
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
                          maxLength={50}
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
