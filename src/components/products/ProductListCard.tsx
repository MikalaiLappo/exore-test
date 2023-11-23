import { Anchor, Badge, Card, Flex, Image, Stack, Text } from '@mantine/core';
import type { Product } from '@/types/products';
import { ProductBadge } from './atoms/ProductBadge';

type ProductListCardProps = { product: Product };

export const ProductListCard = ({
  product: { id, category, image, title, description, price, rating },
}: ProductListCardProps) => (
  <Card
    style={{
      maxWidth: '16rem',
      height: '32rem',
      // borderColor: source === 'local' ? '#ffeb3b61' : '#95ff0091',
    }}
    shadow="sm"
    padding="lg"
    radius="md"
    withBorder
  >
    <Stack h="100%" justify="space-between">
      <Flex style={{ height: 160 }} justify="center" p={8}>
        <Image src={image} height="160" width="auto" />
      </Flex>
      {/* id=-1 for preview Card */}
      <Anchor href={id < 0 ? '#' : `/products/${id}`}>
        <Text fw="bold" pt={8} lineClamp={2}>
          {title}
        </Text>
      </Anchor>
      <Flex justify="space-between">
        <Text td="underline">{Number.isInteger(price) ? price : price.toFixed(2)}$</Text>
        <ProductBadge.Rating rating={rating} />
      </Flex>
      <Text lineClamp={4}>{description}</Text>

      <Badge variant="subtle" color="grey" fullWidth radius="md">
        {category}
      </Badge>
    </Stack>
  </Card>
);
