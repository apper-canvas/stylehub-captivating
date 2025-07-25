import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-secondary-800 border border-secondary-200 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "bg-transparent text-secondary-700 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-4 py-2 text-sm rounded",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-lg"
  }

  return (
    <button
      className={cn(
        "font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button