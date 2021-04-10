const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const productData = [
  {
    title: 'MacBook Pro',
    price: 1500,
    description: '14 inch MacBook Pro',
    categories: {
      create: [
        {
          description: 'Electronics',
        },
      ],
    },
  },
  {
    title: 'Adidas UltraBoost',
    price: 150,
    description: 'Top Rated Running shoes',
    categories: {
      create: [
        {
          description: 'Shoes',
        },
      ],
    },
  },
  {
    title: 'AirMax',
    price: 190,
    description: 'Nike airmax 2020 running shoes',
    categories: {
      create: [
        {
          description: 'Shoes',
        },
        {
          description: 'Active Running Shoes',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const p of productData) {
    const product = await prisma.product.create({
      data: p,
    })
    console.log(`Created Product with id: ${product.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
