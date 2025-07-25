import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No items found",
  description = "There are no items to display at the moment",
  actionText = "Go Back",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold font-display text-secondary-800 mb-4">
        {title}
      </h2>
      
      <p className="text-secondary-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="flex items-center space-x-2"
        >
          <span>{actionText}</span>
          <ApperIcon name="ArrowRight" size={20} />
        </Button>
      )}
    </motion.div>
  )
}

export default Empty