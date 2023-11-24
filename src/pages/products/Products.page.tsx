/* eslint-disable import/extensions */
import { Flex, Text, rem, Container, Group } from '@mantine/core';
import {
  DelimitedArrayParam,
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { useProductsRetriever } from '@/store/hooks.mjs';
import { ProductListCard } from '@/components/products/ProductListCard';
import { ProductsLayout } from './products.layout';
import { ProductFilters } from '@/components/products/ProductFilters';

export const ProductsPage = () => {
  const [products] = useProductsRetriever();
  const allCategories = [...new Set(products.map((p) => p.category))];

  const [filtText, setFiltText] = useQueryParam('text', withDefault(StringParam, ''));
  const [filtCategories, setFiltCategories] = useQueryParam(
    'categories',
    withDefault(DelimitedArrayParam, allCategories)
  );
  const [filtMinPrice, setFiltMinPrice] = useQueryParam('min-price', withDefault(NumberParam, 0));
  const [filtMaxPrice, setFiltMaxPrice] = useQueryParam(
    'max-price',
    withDefault(NumberParam, Infinity)
  );

  const [filtMinReviews, setFiltMinReviews] = useQueryParam(
    'min-reviews',
    withDefault(NumberParam, 0)
  );
  const [filtMinRating, setFiltMinRating] = useQueryParam(
    'min-rating',
    withDefault(StringParam, '0')
  );

  const filteredProducts = products
    .filter(
      (p) =>
        p.rating.count >= filtMinReviews &&
        p.rating.rate >= +filtMinRating &&
        filtCategories.includes(p.category) &&
        p.price >= filtMinPrice &&
        p.price <= filtMaxPrice &&
        (p.description.toLowerCase().includes(filtText.toLowerCase()) ||
          p.title.toLowerCase().includes(filtText.toLowerCase()))
    )
    .map((p) => <ProductListCard searchText={filtText} key={p.id} product={p} />);

  return (
    <ProductsLayout>
      <Flex m={rem(24)} style={{ width: '100%' }}>
        <Group style={{ flex: 9 }}>
          <Container fluid>
            <Flex gap={16} wrap="wrap" justify="center">
              {!filteredProducts.length ? (
                <Text fw="bold" ta="center">
                  No products found
                </Text>
              ) : (
                filteredProducts
              )}
            </Flex>
          </Container>
        </Group>
        <Flex style={{ flex: 3 }}>
          <Container fluid>
            <ProductFilters
              allCategories={allCategories}
              categories={filtCategories.filter((c) => c !== null) as string[]}
              setCategories={setFiltCategories}
              minPrice={filtMinPrice}
              setMinPrice={setFiltMinPrice}
              maxPrice={filtMaxPrice}
              setMaxPrice={setFiltMaxPrice}
              text={filtText}
              setText={setFiltText}
              minRating={filtMinRating}
              setMinRating={setFiltMinRating}
              minReviews={filtMinReviews}
              setMinReviews={setFiltMinReviews}
            />
          </Container>
        </Flex>
      </Flex>
    </ProductsLayout>
  );
};
