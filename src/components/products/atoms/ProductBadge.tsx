/* eslint-disable import/extensions */
import { Badge, Flex } from '@mantine/core';
import type { ProductRating, ProductStatus } from '@/types/products.js';

export const getReviewColor = (n: number) => {
  if (n === 0) return 'grey';
  if (n <= 2) return 'red';
  if (n <= 3.7) return 'yellow';
  return 'green';
};

type ProductRatingBadgeProps = { rating: ProductRating };

export const ProductRatingBadge = ({ rating: { rate, count } }: ProductRatingBadgeProps) => (
  <Flex gap="sm">
    <Badge variant="light" radius="xs" color={getReviewColor(rate)}>
      {rate.toFixed(1)}
    </Badge>
    <Badge variant="light" radius="xs" color="cyan">
      {count}
    </Badge>
  </Flex>
);

type ProductStatusBadgeProps = { source: ProductStatus };

export const ProductStatusBadge = ({ source }: ProductStatusBadgeProps) => (
  <Badge variant="outline" color={source === 'Live' ? 'lime' : 'yellow'}>
    Status: {source}
  </Badge>
);

const ProductBadge = { Rating: ProductRatingBadge, Source: ProductStatusBadge };

export { ProductBadge };
