import { useLocation, useNavigate } from '@remix-run/react';

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

const Steps = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const calculateProgress = () => {
    let value = 1;
    switch (pathname) {
      case '/':
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
            <button
              onClick={() => {
                navigate(url);
              }}
              className="text-2xl font-bold"
              key={step}
            >
              {name}
            </button>
          );
        })}
      </section>

      <section className="bg-gray-100 mb-100">
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

export { Steps };
