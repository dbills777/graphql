// npm run seed:product
const { PrismaClient } = require('@prisma/client')
const shop_products = require('./products.json')

const prisma = new PrismaClient()

async function loadAllCategories() {
  allCategories = shop_products
  return allCategories.map((product) => {
    return {
      data: {
        description: product.category,
      },
    }
  })
}
async function loadAlProducts() {
  allProducts = shop_products
  return allProducts.map((product) => {
    return {
      data: {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      },
    }
  })
}
async function main() {
  const allCategories = await loadAllCategories()
  for (const products of allCategories) {
    try {
      await prisma.category.create(products)
    } catch (err) {
      console.log('There was an error creating a new category')
    }
  }
  const allProducts = await loadAlProducts()
  for (const products of allProducts) {
    try {
      await prisma.product.create(products)
    } catch (err) {
      console.log('There was an error creating a new product', err)
    }
  }
}
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
