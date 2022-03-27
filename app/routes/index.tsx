import { useLoaderData, LoaderFunction } from "remix"
import type { MetaFunction } from "remix"
import { Product } from "~/components/quiosco/Product"
import { Product as ProductType } from "@prisma/client"
import { useContext } from "react"
import { QuioscoContext } from "~/context/quiosco"
import { db } from "~/utils/db.server"

export const meta: MetaFunction = () => {
  return {
    title: "Quiosco Menu",
    description: "Quiosco Cafetería, una comida rápida y de calidad para ti",
  }
}
export const loader: LoaderFunction = async () => {
  const products = await db.product.findMany()
  return products
}

export default function HomeLayout() {
  const products = useLoaderData<ProductType[]>()

  const { categorySelected } = useContext(QuioscoContext)

  const filteredProducts = products.filter(
    (p) => p.categoryId === categorySelected.id
  )

  return (
    <>
      <h1 className="mt-4 text-4xl font-black">
        {categorySelected.name} 🦄🦄🦄🦄
      </h1>
      <p className="my-10 text-2xl">
        Elige y personaliza tu pedido a continuación.
      </p>
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </section>
    </>
  )
}
