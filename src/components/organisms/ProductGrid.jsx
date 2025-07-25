import React from "react"
import { motion } from "framer-motion"
import ProductCard from "@/components/organisms/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry,
  viewMode = "grid" 
}) => {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />
  }

  if (!products || products.length === 0) {
    return (
      <Empty 
        title="No products found"
        description="Try adjusting your filters or search terms"
        actionText="Clear Filters"
        onAction={() => window.location.reload()}
      />
    )
  }

  const gridClasses = viewMode === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 gap-6"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={gridClasses}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid