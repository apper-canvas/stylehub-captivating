import React from "react"
import { cn } from "@/utils/cn"

const PriceDisplay = ({ 
  price, 
  discountedPrice, 
  size = "md", 
  className = "" 
}) => {
  const hasDiscount = discountedPrice && discountedPrice < price
  const discountPercent = hasDiscount 
    ? Math.round(((price - discountedPrice) / price) * 100) 
    : 0

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-semibold text-secondary-800", sizes[size])}>
        ₹{hasDiscount ? discountedPrice : price}
      </span>
      {hasDiscount && (
        <>
          <span className={cn("text-secondary-400 line-through", sizes[size])}>
            ₹{price}
          </span>
          <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  )
}

export default PriceDisplay