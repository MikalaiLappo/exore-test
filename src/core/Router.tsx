import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/Home.page';
import { ProductsPage } from '@/pages/products/Products.page';
import { VieProductPage } from '@/pages/products/ViewProduct.page';
import { AddProductPage } from '@/pages/products/AddProduct.page';

const router = createBrowserRouter([
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
        Component: VieProductPage,
      },
      {
        path: 'add',
        Component: AddProductPage,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
