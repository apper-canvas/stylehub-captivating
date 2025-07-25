import products from "@/services/mockData/products.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(300)
    return [...products]
  },

  async getById(id) {
    await delay(200)
    const product = products.find(p => p.Id === id)
    if (!product) {
      throw new Error("Product not found")
    }
    return { ...product }
  },

  async create(productData) {
    await delay(400)
    const maxId = Math.max(...products.map(p => p.Id), 0)
    const newProduct = {
      ...productData,
      Id: maxId + 1
    }
    products.push(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    await delay(300)
    const index = products.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
    products[index] = { ...products[index], ...productData }
    return { ...products[index] }
  },

  async delete(id) {
    await delay(200)
    const index = products.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
const deletedProduct = products.splice(index, 1)[0]
    return { ...deletedProduct }
  },

  async getRecommendations(productId, category) {
    await delay(200)
    const recommendations = products
      .filter(p => p.Id !== productId && p.category === category && p.inStock)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
    return recommendations.map(p => ({ ...p }))
  }
}