
import { useEffect, useState } from "react"

interface FoodStockGaugeProps {
  value: number
}

export function FoodStockGauge({ value }: FoodStockGaugeProps) {
  const [mounted, setMounted] = useState(false)
 
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
 
  const angle = (value / 100) * 180
 
  let color = "#ef4444"  
  if (value > 30 && value < 70) {
    color = "#f59e0b"  
  } else if (value >= 70) {
    color = "#10b981" 
  }

  return (
    <div className="relative h-32 w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 overflow-hidden">
          <div className="relative h-full w-full">
            {/* Gauge background */}
            <div className="absolute bottom-0 left-0 right-0 h-[50%] rounded-t-full bg-muted" />

            {/* Gauge indicator */}
            <div
              className="absolute bottom-0 left-[50%] h-[50%] w-1 origin-bottom bg-primary"
              style={{
                transform: `translateX(-50%) rotate(${angle - 90}deg)`,
                backgroundColor: color,
              }}
            >
              <div
                className="h-3 w-3 translate-x-[-40%] translate-y-[-30%] rounded-full bg-primary"
                style={{ backgroundColor: color }}
              />
            </div>

            {/* Gauge center point */}
            <div className="absolute bottom-0 left-[50%] h-4 w-4 translate-x-[-50%] translate-y-[50%] rounded-full bg-background border border-border" />

            {/* Value text */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="text-2xl font-bold">{value}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gauge labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-muted-foreground">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  )
}
