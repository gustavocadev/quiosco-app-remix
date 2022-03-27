import { Product as ProductType } from "@prisma/client"
import { useContext } from "react"
import { QuioscoContext } from "~/context/quiosco"

type Props = {
  product: ProductType
}

const Product = ({ product }: Props) => {
  const { name, price, image, id } = product
  const { setProductSelected, toggleProductModal } = useContext(QuioscoContext)

  return (
    <section className="p-3 border">
      <figure>
        <img
          src={`/assets/img/${image}.jpg`}
          alt={`Imagen Platillo ${name}`}
          width={400}
          height={500}
        />
        <figcaption className="p-5">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="mt-5 text-4xl font-black text-amber-500">
            {/* {formatMoney(price, "USD")} */}
            {price}
          </p>
          <button
            className="w-full p-3 mt-3 font-bold text-white uppercase bg-indigo-600 rounded hover:bg-indigo-800"
            onClick={() => {
              // setProduct(product)
              toggleProductModal()
              setProductSelected(product)
            }}
          >
            Agregar
          </button>
        </figcaption>
      </figure>
    </section>
  )
}

export { Product }
