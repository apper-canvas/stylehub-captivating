import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { toast } from "react-toastify"

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

  const isInWishlist = wishlistItems.some(item => item.Id === product.Id)
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.inStock) {
      addToCart({
        productId: product.Id,
        quantity: 1,
        size: product.sizes[0] || "M",
        color: product.colors[0] || "Default",
        price: product.discountedPrice || product.price
      })
      toast.success("Added to cart!")
    }
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      removeFromWishlist(product.Id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.Id}`}>
        <Card 
          hover={true}
          className="group relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Discount Badge */}
            {hasDiscount && (
              <Badge 
                variant="discount" 
                className="absolute top-2 left-2 transform -rotate-12"
              >
                {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
              </Badge>
            )}

            {/* Wishlist Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <ApperIcon 
                name="Heart" 
                size={18} 
                className={`transition-colors duration-200 ${
                  isInWishlist ? "text-red-500 fill-current" : "text-secondary-400"
                }`}
              />
            </motion.button>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 20 
              }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute bottom-2 left-2 right-2"
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-white text-secondary-800 hover:bg-primary hover:text-white border border-secondary-200 hover:border-primary"
                size="sm"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-1">
              <p className="text-sm text-secondary-500 font-medium">
                {product.brand}
              </p>
            </div>
            
            <h3 className="text-sm font-medium text-secondary-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>

            <PriceDisplay
              price={product.price}
              discountedPrice={product.discountedPrice}
              size="sm"
            />

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-secondary-400">
                  Sizes: {product.sizes.join(", ")}
                </p>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

export default ProductCard