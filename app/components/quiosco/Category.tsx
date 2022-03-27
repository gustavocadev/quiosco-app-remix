import { useNavigate, useParams } from "remix"
import { useContext } from "react"
import { QuioscoContext } from "~/context/quiosco"
type Props = {
  name: string
  icon: string
  id: number
}

function Category({ name, icon, id }: Props) {
  const navigate = useNavigate()
  const { pathname } = useParams()
  const { categorySelected, setCategorySelected } = useContext(QuioscoContext)

  return (
    <button
      className={`
       ${categorySelected?.id === id && "bg-amber-400"}
       flex items-center gap-4 w-full border p-5 hover:bg-amber-400 hover:cursor-pointer`}
      onClick={() => {
        if (pathname !== "/") {
          navigate("/")
        }
        setCategorySelected({
          id,
          name,
          icon,
        })
        // getCategoryById(id)
      }}
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
    </button>
  )
}

export { Category }
