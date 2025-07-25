import { useState, useEffect } from "react"
import { productService } from "@/services/api/productService"

export const useCart = () => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("stylehub-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        loadCartWithProducts(parsedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("stylehub-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const loadCartWithProducts = async (cartData) => {
    try {
      const allProducts = await productService.getAll()
      const cartWithProducts = cartData.map(cartItem => ({
        ...cartItem,
        product: allProducts.find(p => p.Id === cartItem.productId)
      }))
      setCartItems(cartWithProducts)
    } catch (error) {
      console.error("Failed to load cart products:", error)
      setCartItems(cartData) // Fallback to cart without product details
    }
  }

  const addToCart = async (item) => {
    try {
      const product = await productService.getById(item.productId)
      
      setCartItems(prevItems => {
        const existingItem = prevItems.find(
          cartItem => 
            cartItem.productId === item.productId &&
            cartItem.size === item.size &&
            cartItem.color === item.color
        )

        if (existingItem) {
          return prevItems.map(cartItem =>
            cartItem.productId === item.productId &&
            cartItem.size === item.size &&
            cartItem.color === item.color
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        }

        return [...prevItems, { ...item, product }]
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.productId !== productId)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  }
}