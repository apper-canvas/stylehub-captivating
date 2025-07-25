import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-toastify"

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Payment Information
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: ""
  })

  const [processing, setProcessing] = useState(false)

  const cartTotal = getCartTotal()
  const cartCount = getCartCount()
  const shippingFee = cartTotal >= 999 ? 0 : 99
  const finalTotal = cartTotal + shippingFee

  const steps = [
    { id: 1, title: "Shipping", icon: "Truck" },
    { id: 2, title: "Payment", icon: "CreditCard" },
    { id: 3, title: "Review", icon: "CheckCircle" }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number")
      return false
    }
    
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode")
      return false
    }
    
    return true
  }

  const validatePayment = () => {
    const required = ["cardNumber", "expiryMonth", "expiryYear", "cvv", "cardholderName"]
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      toast.error("Please enter a valid 16-digit card number")
      return false
    }
    
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      toast.error("Please enter a valid CVV")
      return false
    }
    
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) return
    if (currentStep === 2 && !validatePayment()) return
    
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return
    
    setProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearCart()
      toast.success("Order placed successfully!")
      navigate("/", { state: { orderSuccess: true } })
    } catch (error) {
      toast.error("Failed to process payment. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="ShoppingCart" size={64} className="mx-auto text-secondary-400 mb-4" />
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Your cart is empty</h2>
          <p className="text-secondary-600 mb-6">Add some items to your cart before checkout</p>
          <Button onClick={() => navigate("/")} size="lg">
            Start Shopping
          </Button>
        </div>
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
          <h1 className="text-3xl font-bold font-display text-secondary-800 mb-4">Checkout</h1>
          
          {/* Steps */}
          <div className="flex items-center justify-between max-w-md">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? "bg-primary text-white"
                    : "bg-secondary-200 text-secondary-500"
                } transition-colors duration-200`}>
                  <ApperIcon name={step.icon} size={20} />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-primary" : "text-secondary-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-secondary-200"
                  } transition-colors duration-200`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6">
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Address
                      </label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter full address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        City
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        State
                      </label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Pincode
                      </label>
                      <Input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6">
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cardholder Name
                      </label>
                      <Input
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Enter cardholder name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Card Number
                      </label>
                      <Input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Month
                        </label>
                        <select
                          name="expiryMonth"
                          value={formData.expiryMonth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, "0")}>
                              {month.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Year
                        </label>
                        <select
                          name="expiryYear"
                          value={formData.expiryYear}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          CVV
                        </label>
                        <Input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-2">Shipping Address</h3>
                      <div className="text-secondary-600 text-sm">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.pincode}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.email}</p>
                      </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-2">Payment Method</h3>
                      <div className="text-secondary-600 text-sm">
                        <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                        <p>{formData.cardholderName}</p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{item.product?.name || "Product"}</p>
                              <p className="text-secondary-500">
                                Qty: {item.quantity} • Size: {item.size} • Color: {item.color}
                              </p>
                            </div>
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ArrowLeft" size={20} />
                <span>Previous</span>
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ApperIcon name="ArrowRight" size={20} />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex items-center space-x-2"
                >
                  {processing ? (
                    <>
                      <ApperIcon name="Loader2" size={20} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ApperIcon name="Check" size={20} />
                    </>
                  )}
                </Button>
              )}
            </div>
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

                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-secondary-800">Total</span>
                    <span className="text-xl font-bold text-primary">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="border-t border-secondary-200 pt-4">
                <h3 className="font-semibold text-secondary-800 mb-3">Items ({cartCount})</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex space-x-3">
                      <img
                        src={item.product?.images?.[0] || "/placeholder-image.jpg"}
                        alt={item.product?.name || "Product"}
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-800 truncate">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Qty: {item.quantity} • ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout