/* eslint-disable import/extensions */
import { ProductForm } from '@/components/products/ProductForm';
import { ProductsLayout } from './products.layout';
import { Product } from '@/types/products';
import { useProductCreator } from '@/store/hooks.mjs';

const productStubData: Pick<Product, 'rating' | 'id'> = {
  rating: { rate: 0, count: 0 },
  id: -1,
};

const now = Date.now();

const defaultProductData = {
  title: 'Mens Casual Premium Slim Fit T-Shirts ',
  price: 22.3,
  description:
    'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  source: 'Local',
  status: 'Draft',
  createdAt: now,
  updatedAt: now,
  isDeleted: false,
} as const;

export const AddProductPage = () => {
  const [create, { error, status }] = useProductCreator();
  return (
    <ProductsLayout minRole="Admin">
      <ProductForm
        status={status}
        error={error}
        product={{ ...defaultProductData, ...productStubData }}
        onSubmit={create}
        buttonText="Add Product"
      />
    </ProductsLayout>
  );
};
