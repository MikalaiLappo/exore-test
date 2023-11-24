import { Anchor, Badge, Card, Flex, Highlight, Image, Stack, Text } from '@mantine/core';
import type { Product } from '@/types/products';
import { ProductBadge } from './atoms/ProductBadge';

type ProductListCardProps = { product: Product; searchText?: string };

export const ProductListCard = ({
  product: { id, category, image, title, description, price, rating },
  searchText,
}: ProductListCardProps) => {
  const highlightText = searchText ? searchText.split(/\s+/) : [];

  return (
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
          <Highlight fw="bold" pt={8} lineClamp={2} highlight={highlightText}>
            {title}
          </Highlight>
        </Anchor>
        <Flex justify="space-between">
          <Text fw="bold">{Number.isInteger(price) ? price : price.toFixed(2)}$</Text>
          <ProductBadge.Rating rating={rating} />
        </Flex>
        <Highlight lineClamp={4} highlight={highlightText}>
          {description}
        </Highlight>

        <Badge variant="subtle" color="grey" fullWidth radius="md">
          {category}
        </Badge>
      </Stack>
    </Card>
  );
};
