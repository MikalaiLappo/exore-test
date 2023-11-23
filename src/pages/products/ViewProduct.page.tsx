/* eslint-disable import/extensions */
import { useParams } from 'react-router-dom';
import { Center } from '@mantine/core';
import { useAppSelector } from '@/store/hooks.mjs';
import { ProductFullCard } from '@/components/products/ProductFullCard';
import { ProductsLayout } from './products.layout';

const ProductNotFoundScreen = (props: { isInvalidId: boolean } | { id: number }) => (
  <Center pt={32} fz="xl">
    {'isInvalidId' in props ? 'Product ID is invalid' : `Product with ID "${props.id}" not found`}
  </Center>
);

export const ViewProductPage = () => {
  const { products } = useAppSelector((state) => state.productsStore);
  const { productId: paramId } = useParams();
  const productId = paramId && +paramId;
  if (typeof productId !== 'number' || Number.isNaN(productId)) {
    return <ProductNotFoundScreen isInvalidId />;
  }
  const theProduct = products.find((p) => p.id === productId);
  if (!theProduct) {
    return <ProductNotFoundScreen id={productId} />;
  }

  return (
    <ProductsLayout>
      <Center p={32}>
        <ProductFullCard product={theProduct} />
      </Center>
    </ProductsLayout>
  );
};
