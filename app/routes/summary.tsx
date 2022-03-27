import { ProductSummary } from "../components/quiosco/ProductSummary"
import { LoaderFunction, MetaFunction } from "remix"
import { useContext } from "react"
import { QuioscoContext } from "~/context/quiosco"
import { db } from "~/utils/db.server"

export const meta: MetaFunction = () => {
  return {
    title: "Resumen de pedido",
    description: "Aquí puedes ver el resumen de tu pedido",
  }
}

export const loader: LoaderFunction = async () => {
  const orders = await db.order.findMany()
  return orders
}

export default function Summary() {
  const { orders } = useContext(QuioscoContext)
  return (
    <div>
      <h1 className="text-4xl font-black">Resumen</h1>
      <p className="my-10 text-2xl">Revisa tu pedido</p>
      {orders.length === 0 ? (
        <p className="text-2xl text-center">No hay productos en el carrito</p>
      ) : (
        orders.map((order) => <ProductSummary order={order} key={order.id} />)
      )}
    </div>
  )
}
