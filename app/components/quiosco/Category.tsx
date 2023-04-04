import type { Category as ICategory } from '@prisma/client';
import { Link, useLocation } from '@remix-run/react';

type Props = ICategory;

function Category({ name, icon, id, slug }: Props) {
  // const { categorySelected, setCategorySelected } = useContext(QuioscoContext);
  const location = useLocation();

  return (
    <Link
      className={`
       ${location.pathname === `/category/${slug}` && 'bg-amber-400'}
       flex items-center gap-4 w-full border p-5 hover:bg-amber-400 hover:cursor-pointer`}
      to={`/category/${slug}`}
    >
      <figure>
        <img
          width={70}
          height={70}
          src={`/assets/img/icono_${icon}.svg`}
          alt="Imagen icono"
        />
      </figure>
      <h2 className="text-2xl font-bold ">{name}</h2>
    </Link>
  );
}

export { Category };
