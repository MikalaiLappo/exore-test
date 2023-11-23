/* eslint-disable import/extensions */
import { ProductForm } from '@/components/products/ProductForm';
import { ProductsLayout } from './products.layout';

export const AddProductPage = () => (
  <ProductsLayout minRole="Admin">
    <ProductForm onSubmit={(p) => console.log(p)} buttonText="Add Product" />
  </ProductsLayout>
);
