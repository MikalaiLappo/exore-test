import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/Home.page';
import { ProductsPage } from '@/pages/products/Products.page';
import { ViewProductPage } from '@/pages/products/ViewProduct.page';
import { AddProductPage } from '@/pages/products/AddProduct.page';
import { SignUpPage } from '@/pages/auth/SignUp.page';
import { SignInPage } from '@/pages/auth/SignIn.page';
import { RootLayout } from './root.layout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/products/*',
        children: [
          { index: true, Component: ProductsPage },
          {
            path: ':productId',
            Component: ViewProductPage,
          },
          {
            path: 'add',
            Component: AddProductPage,
          },
        ],
      },
      {
        path: '/auth/*',
        children: [
          { path: 'sign-up', Component: SignUpPage },
          { path: 'sign-in', Component: SignInPage },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
