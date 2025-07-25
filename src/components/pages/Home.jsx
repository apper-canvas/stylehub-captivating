import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ProductGrid from "@/components/organisms/ProductGrid"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = [
    {
      name: "Men",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=300&fit=crop",
      path: "/category/men",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Women", 
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
      path: "/category/women",
      color: "from-pink-500 to-pink-600"
    },
    {
      name: "Kids",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=300&fit=crop", 
      path: "/category/kids",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      path: "/category/home-living", 
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      path: "/category/beauty",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const loadFeaturedProducts = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await productService.getAll()
      setFeaturedProducts(data.slice(0, 8)) // Show first 8 products as featured
    } catch (err) {
      setError("Failed to load featured products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Express Your
              <span className="text-accent-300 block">Unique Style</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto">
              Discover the latest fashion trends and elevate your wardrobe with our curated collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-white text-primary hover:bg-gray-100">
                Shop Women
              </Button>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Shop Men
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-secondary-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore our diverse range of fashion and lifestyle categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link to={category.path}>
                  <Card hover={true} className="group overflow-hidden h-64 relative">
                    <div className="absolute inset-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                    </div>
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold font-display mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white text-opacity-90">Explore Collection</p>
                        <ApperIcon 
                          name="ArrowRight" 
                          size={24} 
                          className="mx-auto mt-2 group-hover:translate-x-1 transition-transform duration-200" 
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-secondary-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Handpicked items that are trending right now
            </p>
          </motion.div>

          <ProductGrid
            products={featuredProducts}
            loading={loading}
            error={error}
            onRetry={loadFeaturedProducts}
          />

          {!loading && !error && featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Link to="/category/all">
                <Button size="lg" variant="outline">
                  View All Products
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "Truck",
                title: "Free Shipping",
                description: "Free shipping on orders above ₹999"
              },
              {
                icon: "RotateCcw", 
                title: "Easy Returns",
                description: "30-day hassle-free return policy"
              },
              {
                icon: "Shield",
                title: "Secure Shopping",
                description: "100% secure payment protection"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home