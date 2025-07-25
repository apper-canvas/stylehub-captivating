import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import ProductGrid from "@/components/organisms/ProductGrid"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"
import { filterService } from "@/services/api/filterService"

const Category = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({})
  const [activeFilters, setActiveFilters] = useState({})
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categoryTitles = {
    "men": "Men's Fashion",
    "women": "Women's Fashion", 
    "kids": "Kids Fashion",
    "home-living": "Home & Living",
    "beauty": "Beauty & Personal Care",
    "all": "All Products"
  }

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "discount", label: "Better Discount" }
  ]

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [productsData, filtersData] = await Promise.all([
        productService.getAll(),
        filterService.getFilters()
      ])
      
      // Filter products by category
      let categoryProducts = productsData
      if (categoryName !== "all") {
        categoryProducts = productsData.filter(
          product => product.category.toLowerCase() === categoryName.replace("-", " ")
        )
      }
      
      setProducts(categoryProducts)
      setFilteredProducts(categoryProducts)
      setFilters(filtersData)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply category filters
    if (activeFilters.categories?.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.categories.includes(product.category)
      )
    }

    // Apply brand filters
    if (activeFilters.brands?.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.brands.includes(product.brand)
      )
    }

    // Apply price range filters
    if (activeFilters.minPrice) {
      const minPrice = parseFloat(activeFilters.minPrice)
      filtered = filtered.filter(product => {
        const price = product.discountedPrice || product.price
        return price >= minPrice
      })
    }

    if (activeFilters.maxPrice) {
      const maxPrice = parseFloat(activeFilters.maxPrice)
      filtered = filtered.filter(product => {
        const price = product.discountedPrice || product.price
        return price <= maxPrice
      })
    }

    // Apply size filters
    if (activeFilters.sizes?.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes?.some(size => activeFilters.sizes.includes(size))
      )
    }

    // Apply color filters
    if (activeFilters.colors?.length > 0) {
      filtered = filtered.filter(product => 
        product.colors?.some(color => activeFilters.colors.includes(color))
      )
    }

    // Apply discount filters
    if (activeFilters.discounts?.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.discountedPrice) return false
        const discountPercent = Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        return activeFilters.discounts.some(discount => {
          const minDiscount = parseInt(discount.split('%')[0])
          return discountPercent >= minDiscount
        })
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { price: priceA, discountedPrice: discountedA } = a
      const { price: priceB, discountedPrice: discountedB } = b
      const finalPriceA = discountedA || priceA
      const finalPriceB = discountedB || priceB

      switch (sortBy) {
        case "price-low-high":
          return finalPriceA - finalPriceB
        case "price-high-low":
          return finalPriceB - finalPriceA
        case "discount":
          const discountA = discountedA ? ((priceA - discountedA) / priceA) * 100 : 0
          const discountB = discountedB ? ((priceB - discountedB) / priceB) * 100 : 0
          return discountB - discountA
        case "newest":
          return b.Id - a.Id
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleClearFilters = () => {
    setActiveFilters({})
  }
useEffect(() => {
    // Scroll to top when category changes or component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loadData()
  }, [categoryName])

  useEffect(() => {
    applyFilters()
  }, [products, activeFilters, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display text-secondary-800 mb-2">
              {categoryTitles[categoryName] || "Products"}
            </h1>
            <p className="text-secondary-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2"
                >
                  <ApperIcon name="Filter" size={20} />
                  <span>Filters</span>
                </Button>

                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-secondary-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-secondary-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <ApperIcon name="Grid3X3" size={18} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <ApperIcon name="List" size={18} />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadData}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category