import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterChip = ({ label, active = false, onRemove, className = "" }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border transition-colors duration-200",
      active 
        ? "bg-primary text-white border-primary" 
        : "bg-white text-secondary-700 border-secondary-200 hover:border-secondary-300",
      className
    )}>
      <span>{label}</span>
      {active && onRemove && (
        <button 
          onClick={onRemove}
          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
        >
          <ApperIcon name="X" size={12} />
        </button>
      )}
    </div>
  )
}

export default FilterChip