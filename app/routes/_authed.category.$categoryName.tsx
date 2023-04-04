import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Product } from '~/components/quiosco';
import { prisma } from '~/utils/db.server';
import { parseForm, parseParams } from 'zodix';
import { z } from 'zod';
import { getUser } from '~/session.server';
import { redirect } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  const { categoryName } = parseParams(params, {
    categoryName: z.string(),
  });

  const categoryFound = await prisma.category.findFirst({
    where: {
      slug: categoryName,
    },
    include: {
      products: true,
    },
  });

  return categoryFound;
}

export async function action({ request }: ActionArgs) {
  const formData = await parseForm(request, {
    _action: z.string(),
    productId: z.string().optional(),
    quantity: z.string().optional(),
    totalPrice: z.string().optional(),
    orderId: z.string().optional(),
  });

  const user = await getUser(request);
  if (!user) return redirect('/login');

  const order = await prisma.order.findFirst({
    where: {
      products: {
        some: {
          id: formData?.productId,
        },
      },
      id: formData?.orderId,
    },
  });

  // we add a product to the cart
  if (formData._action === 'create' && order) {
    // if a order that has the product already exists just update the quantity
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        // we add the quantity to the existing quantity
        quantity: order.quantity + Number(formData.quantity),
        totalPrice: order.totalPrice + Number(formData.totalPrice),
      },
    });
    return {};
  }

  console.log(
    'Un order que ya tenga el producto no existe, asi que creamos uno nuevo'
  );

  // otherwise we create a new order and connect it to the cart
  if (formData._action === 'create' && !order) {
    await prisma.cart.update({
      where: {
        customerId: user.id,
      },
      data: {
        orders: {
          create: {
            customerId: user.id,
            // he we put the quantity and the total price
            quantity: Number(formData.quantity),
            totalPrice: Number(formData.totalPrice),
            // make sure to connect the product to the order
            products: {
              connect: {
                id: formData.productId,
              },
            },
          },
        },
      },
    });
  }

  if (formData._action === 'update' && order) {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        quantity: Number(formData.quantity),
        totalPrice: Number(formData.totalPrice),
      },
    });
  }

  if (formData._action === 'delete' && order) {
    await prisma.order.delete({
      where: {
        id: order.id,
      },
    });
  }

  return {};
}

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: 'Quiosco Menu',
      description: 'Quiosco Cafetería, una comida rápida y de calidad para ti',
    },
  ];
};

export default function CategoryName() {
  const categoryFound = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-4xl font-black">{categoryFound?.name} 🦄🦄🦄🦄</h1>
      <p className="my-10 text-2xl">
        Elige y personaliza tu pedido a continuación.
      </p>
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {categoryFound?.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}
