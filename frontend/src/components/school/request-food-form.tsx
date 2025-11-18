
import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export function RequestFoodForm() {
  const [formState, setFormState] = useState({
    foodItems: [] as string[],
    quantities: {} as Record<string, string>,
    urgency: "medium",
    notes: "",
    deliveryDate: "",
  })

  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally submit the form data to your backend
    console.log(formState)
    setSubmitted(true)

    // Reset form after submission would happen here in a real app
  }

  const foodItemOptions = [
    { value: "rice", label: "Rice" },
    { value: "beans", label: "Beans" },
    { value: "maize", label: "Maize" },
    { value: "vegetables", label: "Vegetables" },
    { value: "fruits", label: "Fruits" },
    { value: "oil", label: "Cooking Oil" },
    { value: "salt", label: "Salt" },
    { value: "sugar", label: "Sugar" },
    { value: "milk", label: "Milk" },
  ]

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/school-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
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
                      <span>{formState.foodItems.join(", ")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Urgency:</span>
                      <span className="capitalize">{formState.urgency}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Requested Delivery:</span>
                      <span>{formState.deliveryDate || "Standard delivery time"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/school-dashboard">Return to Dashboard</Link>
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
                  <div className="space-y-4">
                    <Label>Food Items</Label>

                    <div className="flex gap-2">
                      <Select onValueChange={handleAddFoodItem}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select food item" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodItemOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={formState.foodItems.includes(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formState.foodItems.length > 0 ? (
                      <div className="rounded-md border p-4">
                        <h3 className="mb-2 text-sm font-medium">Selected Items</h3>
                        <div className="space-y-3">
                          {formState.foodItems.map((item) => {
                            const label = foodItemOptions.find((o) => o.value === item)?.label || item
                            return (
                              <div key={item} className="flex items-center gap-2">
                                <div className="w-1/3">
                                  <span className="text-sm">{label}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Quantity (kg)"
                                      value={formState.quantities[item]}
                                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                                      className="w-full"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveFoodItem(item)}
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
                  <Button variant="outline" type="button" asChild>
                    <Link to="/school-dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={formState.foodItems.length === 0}>
                    Submit Request
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
