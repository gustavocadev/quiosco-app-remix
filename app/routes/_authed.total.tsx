import { Form, useLoaderData, useNavigation } from 'react-router';
import { redirect } from 'react-router';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from 'react-router';
import { getUser } from '~/session.server';
import { toast } from 'react-toastify';
import { prisma } from '~/utils/db.server';
import { parseForm } from 'zodix';
import { z } from 'zod';
import { useEffect } from 'react';

export const meta: MetaFunction = () => [
  {
    title: 'Total',
    description: 'Esta seccion es sobre el total del pedido',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  const orders = await prisma.order.findMany({
    where: {
      customerId: user.id,
    },
  });

  const total = orders.reduce((acc, order) => {
    return acc + order.totalPrice;
  }, 0);

  return {
    name: user.name,
    lastName: user.lastName,
    total: Math.round(total),
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  //if the disable the input the form data will be empty
  const formData = await parseForm(request, {
    name: z.string(),
  });
  console.log({ formData });
  // todo: if the user hasn't added an address, redirect to the address page
  // if (!user.address) {
  //   return redirect('/address');
  // }

  // todo: add the address of the user
  await prisma.order.updateMany({
    where: {
      customerId: user.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return redirect('/');
};

export default function TotalPage() {
  const customer = useLoaderData();
  // todo: add the address of the user
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'update';

  useEffect(() => {
    if (isSubmitting) {
      // show a success message
      toast.success('Pedido realizado con exito');
    }
  }, [isSubmitting]);

  return (
    <>
      <>
        <h1 className="text-4xl font-black">Total y confirmar pedido</h1>
        <p className="my-10 text-2xl">Confirma tu pedido</p>
        <Form
          method="POST"
          onSubmit={() => {
            toast.success('Pedido realizado con exito');
          }}
        >
          <section>
            <label
              htmlFor="name"
              className="block text-xl font-bold uppercase text-slate-800"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full p-2 mt-3 bg-gray-200 rounded-md lg:w-1/3"
              autoComplete="off"
              value={`${customer.name} ${customer.lastName}`}
            />
            {/* Agregar el addres del user */}
          </section>
          <section className="mt-10">
            <p className="text-3xl">
              Total a pagar: <span className="font-bold">{customer.total}</span>
            </p>
          </section>
          <section className="mt-5">
            <input type="hidden" name="_action" value="update" />
            <button
              className={`${
                false ? 'bg-indigo-100' : 'bg-indigo-600 hover:bg-indigo-800'
              } w-full lg:w-auto px-5 py-2 rounded uppercase font-bold text-gray-200 text-center ${
                customer.total === 0 && 'cursor-not-allowed opacity-50'
              }`}
              type="submit"
              disabled={customer.total === 0}
            >
              Confirmar pedido
            </button>
          </section>
        </Form>
      </>
    </>
  );
}
