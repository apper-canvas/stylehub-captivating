import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ProductGrid from "@/components/organisms/ProductGrid"
import Empty from "@/components/ui/Empty"
import { useWishlist } from "@/hooks/useWishlist"

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlistItems } = useWishlist()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Empty
          title="Your wishlist is empty"
          description="Save your favorite items to your wishlist and shop them later"
          actionText="Start Shopping"
          onAction={() => navigate("/")}
          icon="Heart"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-secondary-800 mb-2">
            My Wishlist
          </h1>
          <p className="text-secondary-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid
          products={wishlistItems}
          loading={false}
          error=""
          onRetry={() => {}}
        />
      </div>
    </div>
  )
}

export default Wishlist