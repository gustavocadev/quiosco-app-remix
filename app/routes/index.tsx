import { useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { Product } from '~/components/quiosco/Product';
import type { Product as ProductType } from '@prisma/client';
import { useContext } from 'react';
import { QuioscoContext } from '~/context/quiosco';
import { db } from '~/utils/db.server';
import type { LoaderArgs } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return {
    title: 'Quiosco Menu',
    description: 'Quiosco Cafetería, una comida rápida y de calidad para ti',
  };
};
export const loader = async (args: LoaderArgs) => {
  const products: ProductType[] = await db.product.findMany();
  return products;
};

export default function HomeLayout() {
  const products = useLoaderData<typeof loader>();

  const { categorySelected } = useContext(QuioscoContext);

  const filteredProducts = products.filter(
    (p) => p.categoryId === categorySelected.id
  );

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
  );
}
