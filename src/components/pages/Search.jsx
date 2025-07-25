import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductGrid from "@/components/organisms/ProductGrid"
import SearchBar from "@/components/molecules/SearchBar"
import { productService } from "@/services/api/productService"

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadProducts = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([])
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )

    setFilteredProducts(filtered)
  }, [products, query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-secondary-800 mb-4">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mb-6">
            <SearchBar />
          </div>

          {query && (
            <div className="flex items-center justify-between">
              <p className="text-secondary-600">
                {loading ? "Searching..." : `${filteredProducts.length} results for "${query}"`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {query ? (
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onRetry={loadProducts}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">
              What are you looking for?
            </h2>
            <p className="text-secondary-600 mb-8">
              Enter a search term above to find products, brands, and more
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {["Shirts", "Dresses", "Shoes", "Accessories"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => window.location.href = `/search?q=${suggestion}`}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-secondary-700 hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search