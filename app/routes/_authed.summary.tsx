import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ProductSummary } from '~/components/quiosco/ProductSummary';
import { getUser } from '~/session.server';
import { prisma } from '~/utils/db.server';

export const meta: V2_MetaFunction = () => [
  {
    title: 'Resumen de pedido',
    description: 'Aquí puedes ver el resumen de tu pedido',
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user) return null;

  const cart = await prisma.cart.findUnique({
    where: {
      customerId: user.id,
    },
    include: {
      orders: {
        where: {
          customerId: user.id,
        },
        include: {
          products: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!cart) return null;

  // console.log(cart.orders);

  return cart.orders;
};

export default function Summary() {
  const orders = useLoaderData<typeof loader>();
  // console.log({ orders });
  return (
    <div>
      <h1 className="text-4xl font-black">Resumen</h1>
      <p className="my-10 text-2xl">Revisa tu pedido</p>
      {orders?.length === 0 ? (
        <p className="text-2xl text-center">No hay productos en el carrito</p>
      ) : (
        orders?.map((order) => <ProductSummary order={order} key={order.id} />)
      )}
    </div>
  );
}
