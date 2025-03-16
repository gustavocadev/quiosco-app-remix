import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from 'react-router';
import { Form, useLoaderData, useNavigation } from 'react-router';
import { z } from 'zod';
import { parseForm, parseParams } from 'zodix';
import { getUser, isUserAuthenticated, logout } from '~/session.server';
import { prisma } from '~/utils/db.server';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const isAuthenticated = await isUserAuthenticated(request);
  if (!isAuthenticated) return redirect('/login');

  const { username } = parseParams(params, {
    username: z.string().min(1),
  });

  const user = await getUser(request);

  return {
    username,
    user,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  if (!user) return redirect('/login');
  const formData = await parseForm(request, {
    _action: z.string(),
    username: z.string().optional(),
    names: z.string().optional(),
    lastNames: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
    email: z.string().email().optional(),
  });

  if (formData._action === 'update') {
    await prisma.customer.update({
      where: {
        id: user.id,
      },
      data: {
        username: formData.username || user.username,
        address: formData.address || user.address,
        email: formData.email || user.email,
        name: formData.names || user.name,
        lastName: formData.lastNames || user.lastName,
        phone: formData.phone || user.phone,
        password: formData.password || user.password,
      },
    });
    console.log('Datos actualizados');
    return {};
  }

  if (formData._action === 'logout') {
    return logout(request);
  }

  return {};
}

export default function () {
  const { username, user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'update';

  useEffect(() => {
    if (isSubmitting) {
      // show toast
      toast.success('Datos actualizados');
    }
  }, [isSubmitting]);
  return (
    <div className="max-w-2xl mx-auto border mt-20 p-4">
      <section className="flex gap-8 items-center flex-wrap">
        <div className="flex-1">
          <header className="flex justify-between">
            <h1 className="font-bold text-3xl">Informacion general</h1>
            <Form method="POST">
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                name="_action"
                value="logout"
              >
                Cerrar session
              </button>
            </Form>
          </header>

          <Form className="flex flex-col gap-2 p-2" method="POST">
            <input type="hidden" name="_action" value="update" />
            <label htmlFor="username">
              <span>Username</span>
            </label>
            <input
              id="username"
              type="text"
              className="p-2 rounded border bg-gray-50 w-full"
              name="username"
              defaultValue={username}
            />

            <h3 className="font-bold text-xl">Informacion personal</h3>
            <label htmlFor="firstName">
              <span>Nombres</span>
            </label>
            <input
              id="firstName"
              type="text"
              className="p-2 rounded border bg-gray-50 w-full"
              name="names"
              defaultValue={user?.name}
            />

            <label htmlFor="lastNames">
              <span>Apellidos</span>
            </label>
            <input
              id="lastNames"
              type="text"
              className="p-2 rounded border bg-gray-50"
              name="lastNames"
              defaultValue={user?.lastName}
            />

            <label htmlFor="email">
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              className="p-2 rounded border bg-gray-50"
              name="email"
              defaultValue={user?.email}
            />

            <label htmlFor="address">
              <span>Direccion</span>
            </label>
            <input
              id="address"
              type="text"
              className="p-2 rounded border bg-gray-50"
              name="address"
              placeholder='Ej: "Nuevo Ilo, Mz. 2 Lt. 3"'
              defaultValue={user?.address ?? ''}
            />

            <label htmlFor="phone">
              <span>Telefono</span>
            </label>
            <input
              id="phone"
              type="text"
              className="p-2 rounded border bg-gray-50"
              name="phone"
              placeholder='Ej: "92106003"'
              defaultValue={user?.phone ?? ''}
            />

            <h3 className="font-bold text-xl">Cambiar contraseña</h3>

            <label htmlFor="password">
              <span>Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="p-2 rounded border bg-gray-50"
              name="password"
              placeholder="Escribe tu nueva contraseña"
            />

            <button
              type="submit"
              className="bg-indigo-500 rounded w-full text-white px-4 py-2 transition-colors hover:bg-indigo-600"
            >
              Guardar cambios
            </button>
          </Form>
        </div>
      </section>
    </div>
  );
}
