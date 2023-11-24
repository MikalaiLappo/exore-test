/* eslint-disable import/extensions */
import { Flex, Text, rem, Container, Group, Anchor, Button, Center } from '@mantine/core';
import {
  DelimitedArrayParam,
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { useState } from 'react';
import { useProductsRetriever, useSession } from '@/store/hooks.mjs';
import { ProductAdminCard, ProductCard } from '@/components/products/ProductCard';
import { ProductsLayout } from './products.layout';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductStatus } from '@/types/products';
import { Protected } from '@/core/Protected';

export const ProductsPage = () => {
  const [products] = useProductsRetriever();
  const { user } = useSession();

  /**
   * Delete Modal State
   */
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Delete Modal State end

  /**
   * Filters
   */

  const [filtStatusRaw, setFiltStatus] = useQueryParam('status', withDefault(StringParam, ''));
  const filtStatus: ProductStatus =
    user?.role !== 'Admin' ? 'Live' : filtStatusRaw === 'Draft' ? 'Draft' : 'Live';

  const allCategories = [
    ...new Set(products.filter((p) => p.status === filtStatus).map((p) => p.category)),
  ];

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
        p.status === filtStatus &&
        p.rating.count >= filtMinReviews &&
        p.rating.rate >= +filtMinRating &&
        filtCategories.includes(p.category) &&
        p.price >= filtMinPrice &&
        p.price <= filtMaxPrice &&
        (p.description.toLowerCase().includes(filtText.toLowerCase()) ||
          p.title.toLowerCase().includes(filtText.toLowerCase()))
    )
    .map((p) =>
      user?.role === 'Admin' ? (
        <ProductAdminCard
          deletingId={deletingId}
          openDeleteModal={setDeletingId}
          cancelDeleteModal={() => setDeletingId(null)}
          searchText={filtText}
          key={p.id}
          product={p}
        />
      ) : (
        <ProductCard searchText={filtText} key={p.id} product={p} />
      )
    );
  ///// Filters end

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
              status={filtStatus}
              setStatus={setFiltStatus}
            />
            <Protected.Fragment minRole="Admin">
              <Center pt={40}>
                <Anchor href="/products/add">
                  <Button type="button" variant="outline" color="lime">
                    Add Product
                  </Button>
                </Anchor>
              </Center>
            </Protected.Fragment>
          </Container>
        </Flex>
      </Flex>
    </ProductsLayout>
  );
};
