import { productos, categorias } from "./data"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const seed = async () => {
  try {
    await prisma.category.createMany({
      data: categorias,
    })

    await prisma.product.createMany({
      data: productos,
    })
  } catch (error) {
    console.log(error)
  }
}

seed()
