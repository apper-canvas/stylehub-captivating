import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FilterChip from "@/components/molecules/FilterChip"
import ApperIcon from "@/components/ApperIcon"

const FilterSidebar = ({ 
  filters, 
  activeFilters, 
  onFilterChange, 
  onClearFilters,
  isOpen,
  onClose
}) => {
  const filterSections = [
    {
      title: "Categories",
      key: "categories",
      options: filters.categories || []
    },
    {
      title: "Brands",
      key: "brands", 
      options: filters.brands || []
    },
    {
      title: "Price Range",
      key: "priceRange",
      isRange: true
    },
    {
      title: "Sizes",
      key: "sizes",
      options: filters.sizes || []
    },
    {
      title: "Colors",
      key: "colors",
      options: filters.colors || []
    },
    {
      title: "Discounts",
      key: "discounts",
      options: filters.discounts || []
    }
  ]

  const handleFilterToggle = (key, value) => {
    const currentValues = activeFilters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    onFilterChange(key, newValues)
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-800">Filters</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary"
          >
            Clear All
          </Button>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-secondary-100"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(activeFilters).some(key => activeFilters[key]?.length > 0) && (
        <div className="p-4 border-b border-secondary-200">
          <h3 className="text-sm font-medium text-secondary-700 mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) => 
              values?.map(value => (
                <FilterChip
                  key={`${key}-${value}`}
                  label={value}
                  active={true}
                  onRemove={() => handleFilterToggle(key, value)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {filterSections.map((section) => (
          <div key={section.key} className="border-b border-secondary-200 last:border-b-0">
            <div className="p-4">
              <h3 className="text-sm font-medium text-secondary-800 mb-3">
                {section.title}
              </h3>
              
              {section.isRange ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-secondary-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="₹0"
                      className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onChange={(e) => onFilterChange("minPrice", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="₹10000"
                      className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {section.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters[section.key]?.includes(option) || false}
                        onChange={() => handleFilterToggle(section.key, option)}
                        className="rounded border-secondary-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-secondary-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-secondary-200 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-80 max-w-[80vw] bg-white shadow-xl"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default FilterSidebar