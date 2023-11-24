/* eslint-disable import/extensions */
import { useParams } from 'react-router-dom';
import { Center } from '@mantine/core';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductsLayout } from './products.layout';
import { useAppSelector, useProductUpdater } from '@/store/hooks.mjs';

//////////////////
// TODO: decouple shared with `ViewProduct` stuff
const ProductNotFoundScreen = (props: { isInvalidId: boolean } | { id: number }) => (
  <Center pt={32} fz="xl">
    {'isInvalidId' in props ? 'Product ID is invalid' : `Product with ID "${props.id}" not found`}
  </Center>
);
export const EditProductPage = () => {
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
  /////////////////////
  // Client-side delete (stateless mock API)
  if (theProduct.isDeleted) {
    return (
      <Center pt={32} fz="xl">
        Product Deleted
      </Center>
    );
  }
  ///////////////////////

  const [update, { error, status }] = useProductUpdater(productId);
  return (
    <ProductsLayout minRole="Admin">
      <ProductForm
        error={error}
        status={status}
        product={theProduct}
        onSubmit={(p) => update(p)}
        buttonText="Edit Product"
      />
    </ProductsLayout>
  );
};
