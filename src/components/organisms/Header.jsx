import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const categories = [
    { name: "Men", path: "/category/men" },
    { name: "Women", path: "/category/women" },
    { name: "Kids", path: "/category/kids" },
    { name: "Home & Living", path: "/category/home-living" },
    { name: "Beauty", path: "/category/beauty" }
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="bg-white border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold font-display text-gradient">
                StyleHub
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/wishlist")}
                className="relative p-2"
              >
                <ApperIcon name="Heart" size={24} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/cart")}
                className="relative p-2"
              >
                <ApperIcon name="ShoppingBag" size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-cart-bounce">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-white border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 h-12 items-center">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-secondary-700 hover:text-primary font-medium text-sm transition-colors duration-200 relative group"
              >
                {category.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-secondary-100 animate-slide-in">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <SearchBar />
            
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="block px-3 py-2 text-secondary-700 hover:text-primary hover:bg-secondary-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-secondary-100">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/wishlist")
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Heart" size={20} />
                <span>Wishlist ({wishlistItems.length})</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/cart")
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ShoppingBag" size={20} />
                <span>Cart ({cartItemCount})</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header