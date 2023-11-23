/* eslint-disable import/extensions */
import { Center, Flex, Stack } from '@mantine/core';
import { useProductsRetriever } from '@/store/hooks.mjs';
import { ProductListCard } from '@/components/products/ProductListCard';
import { ProductsLayout } from './products.layout';

export const ProductsPage = () => {
  const [products] = useProductsRetriever();
  console.log(products);

  return (
    <ProductsLayout>
      <Stack>
        <Center>
          <Flex gap={16} wrap="wrap" justify="center">
            {products.map((p) => (
              <ProductListCard key={p.id} product={p} />
            ))}
          </Flex>
        </Center>
      </Stack>
    </ProductsLayout>
  );
};
