import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 10,
  className = "" 
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className={`flex items-center border border-secondary-200 rounded-md ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="px-2 py-1 rounded-none border-none hover:bg-secondary-50"
      >
        <ApperIcon name="Minus" size={16} />
      </Button>
      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="px-2 py-1 rounded-none border-none hover:bg-secondary-50"
      >
        <ApperIcon name="Plus" size={16} />
      </Button>
    </div>
  )
}

export default QuantitySelector