import React from "react"
import { motion } from "framer-motion"

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-product overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%]" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-1/3" />
            
            {/* Product Name */}
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-2/3" />
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-2">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-16" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-12" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-14" />
            </div>
            
            {/* Sizes */}
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] rounded w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Loading