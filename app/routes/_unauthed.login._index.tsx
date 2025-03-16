import { Form, Link } from 'react-router';
import { redirect } from 'react-router';
import { parseForm } from 'zodix';
import { z } from 'zod';
import {
  createUserSession,
  isUserAuthenticated,
  login,
} from '~/session.server';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const isAuthenticated = await isUserAuthenticated(request);
  if (isAuthenticated) return redirect('/');

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseForm(request, {
    email: z.string().email(),
    password: z.string().min(5),
  });

  const user = await login(formData.email, formData.password);

  if (!user) {
    return {
      error: true,
    };
  }

  return await createUserSession(request, user.id);
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
            <h1 className="font-bold text-3xl">Login</h1>
          </header>

          <Form className="flex flex-col gap-2 p-2" method="POST">
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
              Login
            </button>
          </Form>

          <footer className="mt-4">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-500">
                Sign up
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
