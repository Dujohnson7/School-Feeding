
import { useState } from "react"
import { AlertCircle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RequestFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestFoodDialog({ open, onOpenChange }: RequestFoodDialogProps) {
  const [foodItem, setFoodItem] = useState("")
  const [quantity, setQuantity] = useState("")
  const [urgency, setUrgency] = useState("medium")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // Here you would normally submit the form data to your backend
    console.log({ foodItem, quantity, urgency })
    setSubmitted(true)

    // Reset form after 2 seconds and close dialog
    setTimeout(() => {
      setFoodItem("")
      setQuantity("")
      setUrgency("medium")
      setSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Food Items</DialogTitle>
          <DialogDescription>Fill out this form to request additional food items for your school.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Request Submitted</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your food request has been submitted successfully. You will be notified when it is approved.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="food-item">Food Item</Label>
                <Select value={foodItem} onValueChange={setFoodItem}>
                  <SelectTrigger id="food-item">
                    <SelectValue placeholder="Select food item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="oil">Cooking Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity in kg"
                />
              </div>

              <div className="grid gap-2">
                <Label>Urgency Level</Label>
                <RadioGroup value={urgency} onValueChange={setUrgency} className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="cursor-pointer">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mx-4">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="cursor-pointer">
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {urgency === "high" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>High Urgency</AlertTitle>
                  <AlertDescription>
                    High urgency requests will be prioritized but require additional approval.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Request</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
