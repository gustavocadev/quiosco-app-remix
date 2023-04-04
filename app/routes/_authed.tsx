import { type LoaderArgs, redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Sidebar, Steps } from '~/components/ui';
import ModalCreateProduct from '~/components/ui/ModalCreateProduct';
import { getUser, isUserAuthenticated } from '~/session.server';
import { prisma } from '~/utils/db.server';

export const loader = async ({ request }: LoaderArgs) => {
  // if the user is not authenticated, redirect to login
  const isAuthenticated = await isUserAuthenticated(request);
  if (!isAuthenticated) return redirect('/login');

  // otherwise, return the categories
  const categories = await prisma.category.findMany();
  const user = await getUser(request);

  return json({
    categories,
    user,
  });
};

export default function () {
  const { categories, user } = useLoaderData<typeof loader>();
  return (
    <>
      <section className="md:flex">
        <aside className="h-screen overflow-y-scroll md:w-4/12 xl:w-1/4 2xl:w-1/5">
          {/* todo: I need to solve this type */}
          {categories && user && (
            <Sidebar categories={categories} user={user} />
          )}
        </aside>
        <main className="h-screen overflow-y-scroll md:w-8/12 xl:w-3/4 2xl:w-4/5">
          <section className="p-10">
            <Steps />
            <Outlet />
          </section>
        </main>
      </section>

      <ModalCreateProduct />
    </>
  );
}
