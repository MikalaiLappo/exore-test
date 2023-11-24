import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { QueryParamProvider } from 'use-query-params';
import { HomePage } from '../pages/Home.page';
import { ProductsPage } from '@/pages/products/Products.page';
import { ViewProductPage } from '@/pages/products/ViewProduct.page';
import { AddProductPage } from '@/pages/products/AddProduct.page';
import { SignUpPage } from '@/pages/auth/SignUp.page';
import { SignInPage } from '@/pages/auth/SignIn.page';
import { RootLayout } from './root.layout';
import { EditProductPage } from '@/pages/products/EditProduct.page';

const router = createBrowserRouter([
  {
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <RootLayout />
      </QueryParamProvider>
    ),
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
          {
            path: 'edit/:productId',
            Component: EditProductPage,
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
