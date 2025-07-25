import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border rounded-md text-secondary-900 bg-white placeholder-secondary-400 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        error ? "border-red-500" : "border-secondary-200 hover:border-secondary-300",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input