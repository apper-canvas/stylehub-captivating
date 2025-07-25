import { toast } from "react-toastify"

export const productService = {
  // Helper to get ApperClient instance
  getClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  // Helper to prepare data for create/update (only Updateable fields)
  prepareUpdateableFields(data) {
    const updateableFields = {
      Name: data.Name || data.name,
      Tags: data.Tags,
      Owner: data.Owner ? parseInt(data.Owner) : undefined,
      brand_c: data.brand_c || data.brand,
      price_c: parseFloat(data.price_c || data.price),
      discounted_price_c: data.discounted_price_c || data.discountedPrice ? parseFloat(data.discounted_price_c || data.discountedPrice) : null,
      images_c: data.images_c || (Array.isArray(data.images) ? data.images.join('\n') : data.images),
      sizes_c: data.sizes_c || (Array.isArray(data.sizes) ? data.sizes.join(',') : data.sizes),
      colors_c: data.colors_c || (Array.isArray(data.colors) ? data.colors.join(',') : data.colors),
      category_c: data.category_c || data.category,
      description_c: data.description_c || data.description,
      in_stock_c: data.in_stock_c !== undefined ? data.in_stock_c : data.inStock
    }

    // Remove undefined fields
    Object.keys(updateableFields).forEach(key => {
      if (updateableFields[key] === undefined) {
        delete updateableFields[key]
      }
    })

    return updateableFields
  },

  async getAll() {
    try {
      const client = this.getClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "discounted_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await client.fetchRecords("product_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      // Transform database fields to UI-compatible format
      return (response.data || []).map(product => ({
        Id: product.Id,
        name: product.Name || '',
        brand: product.brand_c || '',
        price: product.price_c || 0,
        discountedPrice: product.discounted_price_c || null,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split(',').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').filter(color => color.trim()) : [],
        category: product.category_c || '',
        description: product.description_c || '',
        inStock: product.in_stock_c || false,
        // Include original database fields for compatibility
        ...product
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error("Error fetching products:", error.message)
        toast.error("Failed to load products")
      }
      return []
    }
  },

  async getById(id) {
    try {
      const client = this.getClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "discounted_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ]
      }

      const response = await client.getRecordById("product_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Product not found")
      }

      const product = response.data
      if (!product) {
        throw new Error("Product not found")
      }

      // Transform database fields to UI-compatible format
      return {
        Id: product.Id,
        name: product.Name || '',
        brand: product.brand_c || '',
        price: product.price_c || 0,
        discountedPrice: product.discounted_price_c || null,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split(',').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').filter(color => color.trim()) : [],
        category: product.category_c || '',
        description: product.description_c || '',
        inStock: product.in_stock_c || false,
        // Include original database fields for compatibility
        ...product
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message)
        toast.error("Product not found")
      }
      throw error
    }
  },

  async create(productData) {
    try {
      const client = this.getClient()
      const preparedData = this.prepareUpdateableFields(productData)
      
      const params = {
        records: [preparedData]
      }

      const response = await client.createRecord("product_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }

        if (successfulRecords.length > 0) {
          toast.success("Product created successfully!")
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error("Error creating product:", error.message)
        toast.error("Failed to create product")
      }
      return null
    }
  },

  async update(id, productData) {
    try {
      const client = this.getClient()
      const preparedData = this.prepareUpdateableFields(productData)
      preparedData.Id = parseInt(id)
      
      const params = {
        records: [preparedData]
      }

      const response = await client.updateRecord("product_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update product ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }

        if (successfulUpdates.length > 0) {
          toast.success("Product updated successfully!")
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error("Error updating product:", error.message)
        toast.error("Failed to update product")
      }
      return null
    }
  },

  async delete(id) {
    try {
      const client = this.getClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await client.deleteRecord("product_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete product ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        if (successfulDeletions.length > 0) {
          toast.success("Product deleted successfully!")
          return true
        }
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error("Error deleting product:", error.message)
        toast.error("Failed to delete product")
      }
      return false
    }
  },

  async getRecommendations(productId, category) {
    try {
      const client = this.getClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "discounted_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        where: [
          { FieldName: "category_c", Operator: "EqualTo", Values: [category] },
          { FieldName: "in_stock_c", Operator: "EqualTo", Values: [true] }
        ],
        pagingInfo: { limit: 10, offset: 0 }
      }

      const response = await client.fetchRecords("product_c", params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      // Filter out current product and randomize
      const recommendations = (response.data || [])
        .filter(p => p.Id !== parseInt(productId))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)

      // Transform to UI format
      return recommendations.map(product => ({
        Id: product.Id,
        name: product.Name || '',
        brand: product.brand_c || '',
        price: product.price_c || 0,
        discountedPrice: product.discounted_price_c || null,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split(',').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').filter(color => color.trim()) : [],
        category: product.category_c || '',
        description: product.description_c || '',
        inStock: product.in_stock_c || false,
        ...product
      }))
    } catch (error) {
      console.error("Error fetching recommendations:", error.message)
      return []
    }
  }
}