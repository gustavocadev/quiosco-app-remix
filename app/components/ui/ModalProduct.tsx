import { useContext, useEffect, useState } from "react"
import { QuioscoContext } from "../../context/quiosco"
import Modal from "react-modal"
type Props = {}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}
Modal.setAppElement("body")

const ModalProduct = (props: Props) => {
  const {
    toggleProductModal,
    productSelected,
    productModal,
    handleUpdateOrders,
    orders,
    handleEditQuantities,
  } = useContext(QuioscoContext)
  const [quantity, setQuantity] = useState(1)

  const [editProduct, setEditProduct] = useState(false)

  useEffect(() => {
    // if it exists in the orders, set quantity to the quantity in the orders
    if (orders.some((order) => order.id === productSelected?.id)) {
      const productToEdit = orders.find(
        (order) => order.id === productSelected?.id
      )!
      setEditProduct(true)
      setQuantity(productToEdit.quantity)
      return
    }
    setEditProduct(false)
  }, [orders, productSelected])

  return (
    <Modal
      isOpen={productModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <section className="gap-10 md:flex">
        <section className="md:w-1/3">
          <img
            width={300}
            height={400}
            alt={`Imagen Platillo ${productSelected?.name}`}
            src={`/assets/img/${productSelected?.image}.jpg`}
          />
        </section>
        <section className="md:w-2/3">
          <section className="flex justify-end">
            <button onClick={() => toggleProductModal()}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </section>
          <h1 className="mt-5 text-3xl font-bold">{productSelected?.name}</h1>
          <p className="mt-5 text-5xl font-black text-amber-500">
            {productSelected?.price}
          </p>
          <section className="flex gap-4 mt-5">
            <button
              onClick={() => {
                if (quantity <= 1) return
                setQuantity(quantity - 1)
              }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <p className="text-3xl">{quantity}</p>

            <button
              onClick={() => {
                if (quantity >= 5) return
                setQuantity(quantity + 1)
              }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
          </section>

          <button
            type="button"
            className="w-full p-3 mt-3 font-bold text-white uppercase bg-indigo-600 rounded hover:bg-indigo-800"
            onClick={() => {
              if (editProduct) {
                handleEditQuantities(productSelected?.id!, quantity)
                toggleProductModal()
                return
              }
              handleUpdateOrders({
                id: productSelected?.id!,
                name: productSelected?.name!,
                price: productSelected?.price!,
                image: productSelected?.image!,
                quantity,
              })
              toggleProductModal()
              setQuantity(1)
            }}
          >
            {editProduct ? "Editar" : "Agregar"}
          </button>
        </section>
      </section>
    </Modal>
  )
}

export default ModalProduct
