import { useEffect, useContext, useCallback, useState } from 'react';
import { QuioscoContext } from '../context/quiosco/QuioscoContext';
import { Form } from '@remix-run/react';
import { redirect } from '@remix-run/node';
import type { ActionArgs, MetaFunction } from '@remix-run/node';

import { toast } from 'react-toastify';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return {
    title: 'Total',
    description: 'Esta seccion es sobre el total del pedido',
  };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const orders = formData.get('orders') as string;
  const total = formData.get('total') as string;
  const date = Date.now().toString() as string;

  await db.order.create({
    data: {
      name,
      date,
      total: Number(total),
      order: JSON.parse(orders),
    },
  });

  return redirect(`/`);
};

export default function TotalPage() {
  const { orders, totalPrice } = useContext(QuioscoContext);
  const [name, setName] = useState('');

  const isValidOrder = useCallback(() => {
    return orders.length > 0 && name.length > 2;
  }, [orders, name]);

  useEffect(() => {
    isValidOrder();
  }, [orders, isValidOrder]);
  return (
    <>
      <h1 className="text-4xl font-black">Total y confirmar pedido</h1>
      <p className="my-10 text-2xl">Confirma tu pedido</p>
      <Form
        method="post"
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </section>
        <section className="mt-10">
          <p className="text-3xl">
            Total a pagar: <span className="font-bold">{totalPrice}</span>
          </p>
        </section>
        <section className="mt-5">
          <input type="hidden" name="total" value={totalPrice} />
          <input type="hidden" name="orders" value={JSON.stringify(orders)} />
          <button
            className={`${
              !isValidOrder()
                ? 'bg-indigo-100'
                : 'bg-indigo-600 hover:bg-indigo-800'
            } w-full lg:w-auto px-5 py-2 rounded uppercase font-bold text-gray-200 text-center`}
            type="submit"
            disabled={!isValidOrder()}
          >
            Confirmar pedido
          </button>
        </section>
      </Form>
    </>
  );
}
