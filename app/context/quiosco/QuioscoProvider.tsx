import { FC, useReducer, useEffect } from "react"
import { QuioscoContext, quioscoReducer } from "./"
import { Product, Category } from "@prisma/client"
import { CategorySelectedType } from "./"
import { toast } from "react-toastify"

export type CategoriesType = Category & {
  products: Product[]
}

export type NewOrderType = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export type OrderDataType = Product & { quantity: number }

export type QuioscoState = {
  categorySelected: CategorySelectedType
  productModal: boolean
  productSelected?: Product
  orders: NewOrderType[]
  totalPrice: number
}

const quiosco_initial_state: QuioscoState = {
  categorySelected: {
    id: 1,
    name: "Café",
    icon: "cafe",
    products: [],
  },
  productSelected: undefined,
  productModal: false,
  orders: [],
  totalPrice: 0,
}

export const QuioscoProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(quioscoReducer, quiosco_initial_state)
  // const navigate = useNavigate()

  useEffect(() => {
    const totalPrice = state.orders.reduce(
      (prev, order) => order.quantity * order.price + prev,
      0
    )
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice })
  }, [state.orders])

  // ACTIONS
  const setCategorySelected = (category: CategorySelectedType) => {
    dispatch({
      type: "SET_CATEGORY_SELECTED",
      payload: category,
    })
  }

  const toggleProductModal = () => {
    dispatch({
      type: "TOGGLE_PRODUCT_MODAL",
      payload: !state.productModal,
    })
  }
  const setProductSelected = (product: Product) => {
    dispatch({
      type: "SET_PRODUCT_SELECTED",
      payload: product,
    })
  }

  const handleUpdateOrders = (product: NewOrderType) => {
    const isSameProduct = state.orders.some((order) => order.id === product.id)

    if (isSameProduct) {
      const newOrders = state.orders.map((order) => {
        if (order.id !== product.id) return order

        order.quantity += product.quantity

        return order
      })
      dispatch({
        type: "UPDATE_ORDERS",
        payload: newOrders,
      })
      return
    }

    const orders = [...state.orders, product]
    toast.success(`${product.name} agregado al carrito`)
    dispatch({
      type: "UPDATE_ORDERS",
      payload: orders,
    })
  }

  const handleDeleteProduct = (productId: number) => {
    const newOrders = state.orders.filter((order) => order.id !== productId)
    dispatch({
      type: "UPDATE_ORDERS",
      payload: newOrders,
    })
  }

  const handleEditQuantities = (productId: number, quantity: number) => {
    const newOrders = state.orders.map((order) => {
      if (order.id !== productId) return order

      order.quantity = quantity

      return order
    })

    dispatch({
      type: "UPDATE_ORDERS",
      payload: newOrders,
    })
  }

  return (
    <QuioscoContext.Provider
      value={{
        ...state,

        // methods
        setCategorySelected,
        toggleProductModal,
        setProductSelected,
        handleUpdateOrders,
        handleDeleteProduct,
        handleEditQuantities,
      }}
    >
      {children}
    </QuioscoContext.Provider>
  )
}
