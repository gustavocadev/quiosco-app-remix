import type { Product as IProduct } from '@prisma/client';
import { useProductStore } from '~/stores/product';

type Props = {
  product: IProduct;
};

export const Product = ({ product }: Props) => {
  const productStore = useProductStore();
  return (
    <section className="p-3 border">
      <figure>
        <img
          src={`/assets/img/${product.image}.jpg`}
          alt={`Imagen Platillo ${product.name}`}
          width={400}
          height={500}
        />
        <figcaption className="p-5">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="mt-5 text-4xl font-black text-amber-500">
            {/* {formatMoney(price, "USD")} */}${product.price}
          </p>
          <button
            className="w-full p-3 mt-3 font-bold text-white uppercase bg-indigo-600 rounded hover:bg-indigo-800"
            onClick={() => {
              productStore.setIsModalOpen(true);
              productStore.setProductSelected({
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                id: product.id,
                // todo: maybe this shoud be optional
                categorySlug: '',
              });
            }}
          >
            Agregar
          </button>
        </figcaption>
      </figure>
    </section>
  );
};
