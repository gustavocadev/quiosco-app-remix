import type { Category, Customer } from '@prisma/client';
import { Category as CategoryComponent } from '~/components/quiosco/Category';
import { Link, useLocation } from 'react-router';

type Props = {
  categories: Category[];
  user: Customer;
};

export function Sidebar({ categories, user }: Props) {
  const location = useLocation();
  return (
    <>
      <figure className="flex justify-center">
        <Link to="/category/cafe">
          <img width={150} height={50} src="/assets/img/logo.svg" alt="" />
        </Link>
      </figure>
      <nav className="mt-10">
        {/* My Profile */}
        <Link
          className={`
       ${location.pathname === `/${user.username}` && 'bg-amber-400'}
       flex items-center gap-4 w-full border p-5 hover:bg-amber-400 hover:cursor-pointer`}
          to={`/${user.username}`}
        >
          <h2 className="text-2xl font-bold ">Mi perfil</h2>
        </Link>
        {categories.map((category) => (
          <CategoryComponent key={category.id} {...category} />
        ))}
      </nav>
    </>
  );
}
