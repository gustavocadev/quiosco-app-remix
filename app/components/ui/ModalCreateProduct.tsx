import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useFetcher } from 'react-router-dom';
import { useProductStore } from '../../stores/product';
import { useLocation } from '@remix-run/react';
import { toast } from 'react-toastify';

type Props = {};

const ModalCreateProduct = (props: Props) => {
  const fetcher = useFetcher();
  const location = useLocation();

  const isModalOpen = useProductStore(
    (productStore) => productStore.isModalOpen
  );
  const setIsModalOpen = useProductStore(
    (productStore) => productStore.setIsModalOpen
  );
  const productSelected = useProductStore(
    (productStore) => productStore.productSelected
  );

  // const setProductSelected = useProductStore(
  //   (productStore) => productStore.setProductSelected
  // );

  const increaseQuantity = useProductStore(
    (productStore) => productStore.increaseQuantity
  );

  const decreaseQuantity = useProductStore(
    (productStore) => productStore.decreaseQuantity
  );

  const isEditing = useProductStore((productStore) => productStore.isEditing);

  const handleIncreaseQuantity = () =>
    increaseQuantity(productSelected?.quantity ?? 0);

  const handleDecreaseQuantity = () =>
    decreaseQuantity(productSelected?.quantity ?? 0);

  const handleAddProductToCart = () => {
    if (productSelected && !isEditing) {
      fetcher.submit(
        {
          productId: productSelected.id,
          quantity: String(productSelected.quantity),
          totalPrice: String(productSelected.price * productSelected.quantity),
          _action: 'create',
        },
        // this gonna be the action function
        { method: 'POST', action: location.pathname }
      );
    }

    if (productSelected && isEditing) {
      fetcher.submit(
        {
          productId: productSelected.id,
          quantity: String(productSelected.quantity),
          totalPrice: String(productSelected.price * productSelected.quantity),
          _action: 'update',
        },
        // this gonna be the action function
        { method: 'POST', action: `/category/${productSelected.categorySlug}` }
      );
    }

    // close modal
    setIsModalOpen(false);

    // show a toast message
    toast.success(
      `${
        !isEditing
          ? 'Producto agregado al carrito'
          : 'Producto actualizado correctamente'
      } `
    );
  };

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsModalOpen(false);
            // setProductSelected(null)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <figure>
                    <img
                      width={300}
                      height={400}
                      className="mx-auto"
                      alt={`Imagen Platillo ${productSelected?.name}`}
                      src={`/assets/img/${productSelected?.image}.jpg`}
                    />
                  </figure>
                  <Dialog.Title className="mt-5 text-3xl font-bold">
                    {productSelected?.name}
                  </Dialog.Title>
                  <p className="mt-5 text-5xl font-black text-amber-500">
                    {productSelected?.price}
                  </p>
                  <section className="flex gap-4 mt-5">
                    <button onClick={handleDecreaseQuantity}>
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

                    <p className="text-3xl">{productSelected?.quantity}</p>

                    <button onClick={handleIncreaseQuantity}>
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
                    onClick={handleAddProductToCart}
                  >
                    {!isEditing ? 'Agregar al carrito' : 'Actualizar'}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalCreateProduct;
