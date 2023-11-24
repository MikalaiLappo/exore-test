/* eslint-disable import/extensions */
import { useParams } from 'react-router-dom';
import { Center } from '@mantine/core';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductsLayout } from './products.layout';
import { useAppSelector } from '@/store/hooks.mjs';

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
  if (theProduct.isDeleted) {
    return (
      <Center pt={32} fz="xl">
        Product Deleted
      </Center>
    );
  }

  return (
    <ProductsLayout minRole="Admin">
      <ProductForm
        product={theProduct}
        onSubmit={(p) => console.log(p)}
        buttonText="Edit Product"
      />
    </ProductsLayout>
  );
};
