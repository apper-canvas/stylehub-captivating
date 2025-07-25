import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import QuantitySelector from "@/components/molecules/QuantitySelector"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { toast } from "react-toastify"
import ProductGrid from "@/components/organisms/ProductGrid"

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

  const isInWishlist = wishlistItems.some(item => item.Id === parseInt(productId))

const loadProduct = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await productService.getById(parseInt(productId))
      setProduct(data)
      setSelectedSize(data.sizes?.[0] || "")
      setSelectedColor(data.colors?.[0] || "")
      
      // Load recommendations
      setLoadingRecommendations(true)
      try {
        const recommendationsData = await productService.getRecommendations(data.Id, data.category)
        setRecommendations(recommendationsData)
      } catch (recError) {
        console.log("Failed to load recommendations:", recError)
      } finally {
        setLoadingRecommendations(false)
      }
    } catch (err) {
      setError("Product not found")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size")
      return
    }

    addToCart({
      productId: product.Id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      price: product.discountedPrice || product.price
    })

    toast.success("Added to cart!")
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.Id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  useEffect(() => {
    loadProduct()
  }, [productId])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />
  }

  if (!product) {
    return <Error message="Product not found" onRetry={() => navigate("/")} />
  }

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <button onClick={() => navigate("/")} className="hover:text-primary">
              Home
            </button>
            <ApperIcon name="ChevronRight" size={16} />
            <button 
              onClick={() => navigate(`/category/${product.category.toLowerCase().replace(" ", "-")}`)}
              className="hover:text-primary"
            >
              {product.category}
            </button>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-secondary-800">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? "border-primary shadow-md" 
                          : "border-secondary-200 hover:border-secondary-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Brand & Name */}
            <div>
              <p className="text-primary font-semibold mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold font-display text-secondary-800 mb-4">
                {product.name}
              </h1>
              
              {/* Price */}
              <PriceDisplay
                price={product.price}
                discountedPrice={product.discountedPrice}
                size="xl"
                className="mb-4"
              />

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={product.inStock ? "success" : "error"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                {hasDiscount && (
                  <Badge variant="discount">
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-all duration-200 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-secondary-200 hover:border-secondary-300 text-secondary-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                  Select Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md transition-all duration-200 ${
                        selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-secondary-200 hover:border-secondary-300 text-secondary-700"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                Quantity
              </h3>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={10}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className="px-4"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={20} 
                    className={isInWishlist ? "text-red-500 fill-current" : ""} 
                  />
                </Button>
              </div>
              
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                variant="primary"
                size="lg"
                className="w-full bg-accent text-white hover:bg-accent-600"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Description */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                Product Details
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="border-t border-secondary-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Truck" size={20} className="text-primary" />
                  <span className="text-sm text-secondary-600">Free shipping on orders above ₹999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="RotateCcw" size={20} className="text-primary" />
                  <span className="text-sm text-secondary-600">30-day return policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Shield" size={20} className="text-primary" />
                  <span className="text-sm text-secondary-600">1 year warranty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Award" size={20} className="text-primary" />
                  <span className="text-sm text-secondary-600">Authentic products</span>
                </div>
              </div>
</div>
          </motion.div>
        </div>

        {/* You May Also Like Section */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 border-t border-secondary-200 pt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-display text-secondary-800 mb-2">
                You May Also Like
              </h2>
              <p className="text-secondary-600">
                Discover more products similar to this one
              </p>
            </div>
            
            <ProductGrid
              products={recommendations}
              loading={loadingRecommendations}
              error=""
              showFilters={false}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail