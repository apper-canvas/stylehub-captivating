import { useState, useEffect } from "react"
import { productService } from "@/services/api/productService"

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("stylehub-wishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        setWishlistItems(parsedWishlist)
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("stylehub-wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.Id === product.Id)
      if (exists) {
        return prevItems
      }
      return [...prevItems, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems =>
      prevItems.filter(item => item.Id !== productId)
    )
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.Id === productId)
  }

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  }
}