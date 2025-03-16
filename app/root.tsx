import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { LinksFunction } from 'react-router';
import './tailwind.css';

// Ts Reset
import '@total-typescript/ts-reset';

import toastStyles from 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toastStyles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        {/* My Globals components */}
        <ToastContainer />

        {/* Remix components */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
