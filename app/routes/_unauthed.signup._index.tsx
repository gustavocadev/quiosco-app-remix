import { Form, Link } from '@remix-run/react';
import { type LoaderArgs, json, redirect } from '@remix-run/node';
import { isUserAuthenticated, signup } from '~/session.server';
import type { ActionArgs } from '@remix-run/node';
import { parseForm } from 'zodix';
import { z } from 'zod';

export async function loader({ request }: LoaderArgs) {
  const isAuthenticated = await isUserAuthenticated(request);
  if (isAuthenticated) return redirect('/');

  return json({
    msg: 'ok',
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await parseForm(request, {
    email: z.string().email(),
    password: z.string().min(5),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  });

  await signup({
    email: formData.email,
    password: formData.password,
    name: formData.firstName,
    lastName: formData.lastName,
  });

  return redirect('/login');
}

export default function () {
  return (
    <div className="max-w-2xl mx-auto border mt-20 p-4">
      <section className="flex gap-8 items-center flex-wrap">
        <figure className="flex justify-center items-center flex-1">
          <img src="/assets/img/logo.svg" className="w-48" alt="" />
        </figure>

        <div className="flex-1">
          <header>
            <h1 className="font-bold text-3xl">Sign up</h1>
          </header>

          <Form className="flex flex-col gap-2 p-2" method="POST">
            <label htmlFor="firstName">
              <span>First name</span>
            </label>
            <input
              id="firstName"
              type="text"
              className="p-2 rounded border bg-gray-50 w-full"
              name="firstName"
            />

            <label htmlFor="lastName">
              <span>Last name</span>
            </label>
            <input
              id="lastName"
              type="text"
              className="p-2 rounded border bg-gray-50"
              name="lastName"
            />

            <label htmlFor="email">
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              className="p-2 rounded border bg-gray-50"
              name="email"
            />

            <label htmlFor="password">
              <span>Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="p-2 rounded border bg-gray-50"
              name="password"
            />

            <button
              type="submit"
              className="bg-indigo-500 rounded w-full text-white px-4 py-2 transition-colors hover:bg-indigo-600"
            >
              Crear cuenta
            </button>
          </Form>
          <footer className="mt-4">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-500">
                Login
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
