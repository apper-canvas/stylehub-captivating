import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  className, 
  hover = false,
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-product border border-white transition-all duration-200",
        hover && "hover:shadow-product-hover hover:-translate-y-1 cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card