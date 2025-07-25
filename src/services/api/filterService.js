import { toast } from "react-toastify"

export const filterService = {
  // Helper to get ApperClient instance
  getClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  async getFilters() {
    try {
      const client = this.getClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "categories_c" } },
          { field: { Name: "brands_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "discounts_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await client.fetchRecords("filter_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        // Return fallback filter structure
        return {
          categories: ["Men", "Women", "Kids", "Home & Living", "Beauty"],
          brands: [],
          sizes: [],
          colors: [],
          discounts: ["10% and above", "20% and above", "30% and above", "40% and above", "50% and above"]
        }
      }

      // Process filter data from database
      const filterData = response.data || []
      
      // Combine all filter values from multiple records
      const combinedFilters = {
        categories: [],
        brands: [],
        sizes: [],
        colors: [],
        discounts: []
      }

      filterData.forEach(filter => {
        if (filter.categories_c) {
          const categories = filter.categories_c.split(',').map(c => c.trim()).filter(c => c)
          combinedFilters.categories.push(...categories)
        }
        if (filter.brands_c) {
          const brands = filter.brands_c.split(',').map(b => b.trim()).filter(b => b)
          combinedFilters.brands.push(...brands)
        }
        if (filter.sizes_c) {
          const sizes = filter.sizes_c.split(',').map(s => s.trim()).filter(s => s)
          combinedFilters.sizes.push(...sizes)
        }
        if (filter.colors_c) {
          const colors = filter.colors_c.split(',').map(c => c.trim()).filter(c => c)
          combinedFilters.colors.push(...colors)
        }
        if (filter.discounts_c) {
          const discounts = filter.discounts_c.split(',').map(d => d.trim()).filter(d => d)
          combinedFilters.discounts.push(...discounts)
        }
      })

      // Remove duplicates and return
      return {
        categories: [...new Set(combinedFilters.categories)],
        brands: [...new Set(combinedFilters.brands)],
        sizes: [...new Set(combinedFilters.sizes)],
        colors: [...new Set(combinedFilters.colors)],
        discounts: [...new Set(combinedFilters.discounts)]
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching filters:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error("Error fetching filters:", error.message)
        toast.error("Failed to load filters")
      }
      
      // Return fallback filter structure
      return {
        categories: ["Men", "Women", "Kids", "Home & Living", "Beauty"],
        brands: [],
        sizes: [],
        colors: [],
        discounts: ["10% and above", "20% and above", "30% and above", "40% and above", "50% and above"]
      }
    }
  }
}