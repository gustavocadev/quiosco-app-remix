import { useLocation, Link } from 'react-router';

const steps = [
  {
    step: 1,
    title: 'Elige tu producto',
    url: '/',
    name: 'Menú',
  },
  {
    step: 2,
    name: 'Resumen',
    url: '/summary',
  },
  {
    step: 3,
    name: 'Datos y total del pedido',
    url: '/total',
  },
];

export const Steps = () => {
  const { pathname } = useLocation();
  const calculateProgress = () => {
    let value = 1;
    switch (pathname) {
      case `/category/${pathname.split('/')[2]}`:
        value = 1;
        return value;
      case '/summary':
        value = 50;
        return value;
      case '/total':
        value = 100;
        return value;
    }
  };

  return (
    <>
      <section className="flex justify-between mb-5">
        {steps.map(({ step, name, url }) => {
          return (
            <Link to={url} className="text-2xl font-bold" key={step}>
              {name}
            </Link>
          );
        })}
      </section>

      <section className="bg-gray-100 mb-10">
        <div
          className={`rounded-full bg-amber-500 text-xs leading-none h-2 text-center text-white ]`}
          style={{
            width: `${calculateProgress()}%`,
          }}
        ></div>
      </section>
    </>
  );
};
