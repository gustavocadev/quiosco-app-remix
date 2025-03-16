import type { Category, Order, Product } from '@prisma/client';
import { Form, useFetcher } from 'react-router';
import { toast } from 'react-toastify';
import { useProductStore } from '~/stores/product';

type Props = {
  order: Order & {
    products: (Product & { category: Category })[];
  };
};

export const ProductSummary = ({ order }: Props) => {
  const setIsModalOpen = useProductStore(
    (productStore) => productStore.setIsModalOpen
  );
  const setProductSelected = useProductStore(
    (productStore) => productStore.setProductSelected
  );
  const setIsEditing = useProductStore(
    (productStore) => productStore.setIsEditing
  );

  const fetcher = useFetcher();

  const handleUpdateProductCart = () => {
    setIsEditing(true);
    setProductSelected({
      name: order.products[0].name,
      price: order.products[0].price,
      image: order.products[0].image,
      quantity: order.quantity,
      id: order.products[0].id,
      categorySlug: order.products[0].category.slug,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProductCart = () => {
    fetcher.submit(
      {
        _action: 'delete',
        orderId: order.id,
      },
      {
        method: 'POST',
        action: `/category/${order.products[0].category.slug}`,
      }
    );

    toast.success('Producto eliminado del carrito');
  };
  return (
    <section className="flex items-center gap-10 p-3 mb-3 border shadow">
      <figure className="md:w-1/6">
        <img
          width={300}
          height={400}
          // todo: fix this [0]
          alt={`Imagen Platillo ${order.products[0].name}`}
          src={`/assets/img/${order.products[0].image}.jpg`}
        />
      </figure>
      <section className="md:w-4/6">
        <p className="text-3xl font-bold">{order.products[0].name}</p>
        <p className="mt-2 text-xl font-bold">Cantidad: {order.quantity}</p>
        <p className="mt-2 text-xl font-bold text-amber-700">
          Precio: {order.products[0].price}
        </p>
        <p className="mt-2 text-lg font-bold text-gray-800">
          Subtotal: {order.totalPrice}
        </p>
      </section>

      <section className="md:w-1/6">
        <button
          className="flex w-full gap-2 px-5 py-2 font-bold text-gray-200 uppercase rounded shadow-md bg-sky-700"
          onClick={handleUpdateProductCart}
        >
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          Editar
        </button>

        <button
          className="flex w-full gap-2 px-5 py-2 mt-3 font-bold text-gray-200 uppercase bg-red-700 rounded shadow-md"
          onClick={handleDeleteProductCart}
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          Eliminar
        </button>
      </section>
    </section>
  );
};
