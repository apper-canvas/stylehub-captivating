import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Oops!",
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500" />
      </div>
      
      <h2 className="text-2xl font-bold font-display text-secondary-800 mb-4">
        {title}
      </h2>
      
      <p className="text-secondary-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={20} />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Error