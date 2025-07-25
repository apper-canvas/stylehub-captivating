import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  const footerSections = [
    {
      title: "Online Shopping",
      links: [
        { name: "Men", href: "/category/men" },
        { name: "Women", href: "/category/women" },
        { name: "Kids", href: "/category/kids" },
        { name: "Home & Living", href: "/category/home-living" },
        { name: "Beauty", href: "/category/beauty" }
      ]
    },
    {
      title: "Customer Policies",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Return Policy", href: "/returns" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" }
      ]
    },
    {
      title: "Useful Links",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Site Map", href: "/sitemap" },
        { name: "Corporate Information", href: "/corporate" }
      ]
    }
  ]

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Youtube", icon: "Youtube", href: "#" }
  ]

  return (
    <footer className="bg-secondary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <h2 className="text-2xl font-bold font-display text-gradient">
                  StyleHub
                </h2>
              </Link>
              <p className="text-secondary-300 text-sm mb-6">
                Your ultimate destination for fashion and lifestyle. Discover the latest trends and express your unique style.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-secondary-700 rounded-full hover:bg-primary transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <ApperIcon name={social.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-secondary-300 text-sm hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-secondary-700 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">
                Stay updated with latest trends
              </h3>
              <p className="text-secondary-300 text-sm">
                Subscribe to our newsletter and get 20% off your first order
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-l-md text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-primary text-white rounded-r-md hover:shadow-lg transition-shadow duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-secondary-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-secondary-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 StyleHub. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" size={16} />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Truck" size={16} />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="RotateCcw" size={16} />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer