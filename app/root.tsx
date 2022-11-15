import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node';
import styles from './tailwind.css';
import { Steps, Sidebar } from '~/components/ui';
import { QuioscoProvider } from './context/quiosco/QuioscoProvider';
import ModalProduct from './components/ui/ModalProduct';
import { ToastContainer } from 'react-toastify';
import toastStyles from 'react-toastify/dist/ReactToastify.min.css';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader = async (args: LoaderArgs) => {
  const categories = await db.category.findMany();
  return { categories };
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: toastStyles },
];

export default function App() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="">
        <QuioscoProvider>
          <section className="md:flex">
            <aside className="h-screen overflow-y-scroll md:w-4/12 xl:w-1/4 2xl:w-1/5">
              <Sidebar categories={categories} />
            </aside>
            <main className="h-screen overflow-y-scroll md:w-8/12 xl:w-3/4 2xl:w-4/5">
              <section className="p-10">
                <Steps />
                <Outlet />
              </section>
            </main>
          </section>

          <ModalProduct />
          <ToastContainer />
        </QuioscoProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
