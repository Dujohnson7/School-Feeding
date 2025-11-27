
import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Item {
  id: string
  name: string
  category?: string
  unit?: string
}

export function RequestFoodForm() {
  const [formState, setFormState] = useState({
    foodItems: [] as string[],
    quantities: {} as Record<string, string>, 
    notes: "", 
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8070/api/item/all")
        if (!response.ok) {
          throw new Error("Failed to fetch items")
        }
        const data = await response.json()
        setItems(data)
      } catch (err) {
        console.error("Error fetching items:", err)
        toast({
          title: "Error",
          description: "Failed to load food items. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoadingItems(false)
      }
    }

    fetchItems()
  }, [])
 
  const getItemIdByName = (name: string): string | null => {
    const normalizedName = name.toLowerCase().trim()
    const item = items.find(
      (i) => i.name.toLowerCase().trim() === normalizedName
    )
    return item?.id || null
  }

  const handleAddFoodItem = (item: string) => {
    if (item && !formState.foodItems.includes(item)) {
      setFormState({
        ...formState,
        foodItems: [...formState.foodItems, item],
        quantities: { ...formState.quantities, [item]: "" },
      })
    }
  }

  const handleRemoveFoodItem = (item: string) => {
    const newFoodItems = formState.foodItems.filter((i) => i !== item)
    const newQuantities = { ...formState.quantities }
    delete newQuantities[item]

    setFormState({
      ...formState,
      foodItems: newFoodItems,
      quantities: newQuantities,
    })
  }

  const handleQuantityChange = (item: string, quantity: string) => {
    setFormState({
      ...formState,
      quantities: { ...formState.quantities, [item]: quantity },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
 
    const missingQuantities = formState.foodItems.filter(
      (item) => !formState.quantities[item] || formState.quantities[item].trim() === ""
    )

    if (missingQuantities.length > 0) {
      setError("Please enter quantities for all selected items.")
      return
    }
 
    const invalidQuantities = formState.foodItems.filter((item) => {
      const qty = parseFloat(formState.quantities[item])
      return isNaN(qty) || qty <= 0
    })

    if (invalidQuantities.length > 0) {
      setError("Please enter valid positive quantities for all items.")
      return
    }
 
    const districtId = localStorage.getItem("districtId")
    const schoolId = localStorage.getItem("schoolId")
    const token = localStorage.getItem("token")

    if (!districtId || !schoolId) {
      setError("District or school information is missing. Please log in again.")
      return
    }

    if (!token) {
      setError("Authentication required. Please log in again.")
      return
    }
 
    const requestItemDetails = formState.foodItems
      .map((itemName) => {
        const itemId = getItemIdByName(itemName)
        if (!itemId) {
          return null
        }
        return {
          item: { id: itemId },
          quantity: parseFloat(formState.quantities[itemName]),
        }
      })
      .filter((detail): detail is { item: { id: string }; quantity: number } => detail !== null)

    if (requestItemDetails.length === 0) {
      setError("Could not find item IDs for the selected items. Please try again.")
      return
    }
 
    const requestPayload = {
      district: { id: districtId },
      school: { id: schoolId },
      requestItemDetails,
      description: formState.notes || "Food request from school",
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8070/api/requestRequestItem/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMessage =
          data?.message || data?.error || response.statusText || "Failed to submit request"
        throw new Error(errorMessage)
      }

      toast({
        title: "Success",
        description: "Your food request has been submitted successfully.",
      })

      setSubmitted(true)
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to submit request. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
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
          <Link to="/school-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-w-0">
          {submitted ? (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Request Submitted Successfully</CardTitle>
                <CardDescription className="text-center">
                  Your food request has been submitted and is pending approval.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Request Summary</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>
                        {formState.foodItems
                          .map(
                            (item) =>
                              `${item} (${formState.quantities[item]} kg)`
                          )
                          .join(", ")}
                      </span>
                    </div>  
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/request-food-list">Okay, got it!</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <CardTitle>Request Food Items</CardTitle>
                  <CardDescription>
                    Fill out this form to request additional food items for your school.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <Label>Food Items</Label>

                    <div className="flex gap-2">
                      <Select onValueChange={handleAddFoodItem} disabled={loadingItems}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingItems ? "Loading items..." : "Select food item"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingItems ? (
                            <SelectItem value="loading" disabled>
                              Loading items...
                            </SelectItem>
                          ) : items.length > 0 ? (
                            items.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.name}
                                disabled={formState.foodItems.includes(item.name)}
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-items" disabled>
                              No items available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {formState.foodItems.length > 0 ? (
                      <div className="rounded-md border p-4">
                        <h3 className="mb-2 text-sm font-medium">Selected Items</h3>
                        <div className="space-y-3">
                          {formState.foodItems.map((item) => {
                            return (
                              <div key={item} className="flex items-center gap-2">
                                <div className="w-1/3">
                                  <span className="text-sm">{item}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Quantity (kg)"
                                      value={formState.quantities[item]}
                                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                                      className="w-full"
                                      min="0"
                                      step="0.01"
                                      required
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveFoodItem(item)}
                                      disabled={loading}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          No items selected. Please select at least one food item.
                        </p>
                      </div>
                    )}
                  </div>
 
 

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or requirements"
                      value={formState.notes}
                      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" asChild disabled={loading}>
                    <Link to="/school-dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={formState.foodItems.length === 0 || loading || loadingItems}>
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
