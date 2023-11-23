import { Anchor, Card, Flex, Image, Stack, Text } from '@mantine/core';
import type { Product } from '@/types/products';
import { ProductBadge } from './atoms/ProductBadge';
import { CategoryButton } from './atoms/CategoryButton';

type ProductFullCard = { product: Product };

export const ProductFullCard = ({
  product: { id, category, status, image, title, description, price, rating },
}: ProductFullCard) => (
  <Card
    style={{
      maxWidth: '48rem',
      height: 'auto',
    }}
    shadow="sm"
    padding="lg"
    radius="md"
    withBorder
  >
    <Flex p={8}>
      <Stack style={{ width: '8rem', flex: '2' }} align="center" justify="center">
        <Image src={image} height="auto" width="auto" />
        <Text td="underline">{Number.isInteger(price) ? price : price.toFixed(2)}$</Text>{' '}
        <ProductBadge.Rating rating={rating} />
        <ProductBadge.Source source={status} />
      </Stack>
      {/* id=-1 for preview Card */}
      <Stack style={{ flex: '5' }} p={16} justify="space-between" align="center">
        <Anchor href={id < 0 ? '#' : `/products/${id}`}>
          <Text fw="bold">{title}</Text>
        </Anchor>
        <Text ta="center">{description}</Text>
        <CategoryButton category={category} />
      </Stack>
    </Flex>
  </Card>
);
