import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import QuantitySelector from "@/components/molecules/QuantitySelector"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import ApperIcon from "@/components/ApperIcon"
import Empty from "@/components/ui/Empty"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-toastify"

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      toast.success("Item removed from cart")
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
    toast.success("Item removed from cart")
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    navigate("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Empty
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet"
          actionText="Start Shopping"
          onAction={() => navigate("/")}
          icon="ShoppingCart"
        />
      </div>
    )
  }

  const cartTotal = getCartTotal()
  const cartCount = getCartCount()
  const shippingFee = cartTotal >= 999 ? 0 : 99
  const finalTotal = cartTotal + shippingFee

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
            Shopping Cart
          </h1>
          <p className="text-secondary-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.productId}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || "/placeholder-image.jpg"}
                        alt={item.product?.name || "Product"}
                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-primary font-medium">
                            {item.product?.brand || "Brand"}
                          </p>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-lg font-semibold text-secondary-800 hover:text-primary transition-colors duration-200"
                          >
                            {item.product?.name || "Product Name"}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-1 text-secondary-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-4">
                        {item.size && (
                          <span>Size: <strong>{item.size}</strong></span>
                        )}
                        {item.color && (
                          <span>Color: <strong>{item.color}</strong></span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) => 
                            handleQuantityChange(item.productId, newQuantity)
                          }
                          min={0}
                          max={10}
                        />
                        
                        <div className="text-right">
                          <PriceDisplay
                            price={item.price * item.quantity}
                            size="lg"
                          />
                          {item.quantity > 1 && (
                            <p className="text-sm text-secondary-500">
                              ₹{item.price} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal ({cartCount} items)</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className={`font-medium ${shippingFee === 0 ? "text-green-600" : ""}`}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>

                {cartTotal < 999 && (
                  <div className="text-sm text-secondary-500">
                    Add ₹{999 - cartTotal} more for free shipping
                  </div>
                )}

                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-secondary-800">Total</span>
                    <span className="text-xl font-bold text-primary">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full mb-4"
              >
                Proceed to Checkout
                <ApperIcon name="ArrowRight" size={20} className="ml-2" />
              </Button>

              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ApperIcon name="Shield" size={16} className="text-green-600" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ApperIcon name="RotateCcw" size={16} className="text-green-600" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600">
                    <ApperIcon name="Truck" size={16} className="text-green-600" />
                    <span>Fast & reliable delivery</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart