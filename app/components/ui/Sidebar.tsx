import type { Category } from "@prisma/client"
import { Category as CategoryComponent } from "~/components/quiosco/Category"

type Props = {
  categories: Category[]
}

function Sidebar({ categories }: Props) {
  return (
    <>
      <figure className="flex justify-center">
        <img width={150} height={50} src="/assets/img/logo.svg" alt="" />
      </figure>
      <nav className="mt-10">
        {categories.map((category) => (
          <CategoryComponent key={category.id} {...category} />
        ))}
      </nav>
    </>
  )
}

export { Sidebar }
