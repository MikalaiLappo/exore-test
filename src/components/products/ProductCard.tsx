/* eslint-disable import/extensions */
import {
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Highlight,
  Image,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { ReactNode } from 'react';
import type { Product, ProductId } from '@/types/products';
import { ProductBadge } from './atoms/ProductBadge';
import { Protected } from '@/core/Protected';
import { useProductRemover } from '@/store/hooks.mjs';

type ProductCardProps = { product: Product; searchText?: string; children?: ReactNode };

export const ProductCard = ({
  product: { id, category, image, title, description, price, rating },
  searchText,
  children,
}: ProductCardProps) => {
  const highlightText = searchText ? searchText.split(/\s+/) : [];

  return (
    <Card
      style={{
        maxWidth: '16rem',
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
        {children}
      </Stack>
    </Card>
  );
};

type ProductAdminCardProps = Omit<ProductCardProps, 'children'> & {
  deletingId: ProductId | null;
  openDeleteModal: (id: ProductId) => void;
  cancelDeleteModal: () => void;
};
export const ProductAdminCard = (props: ProductAdminCardProps) => {
  const [remove, { error, status }] = useProductRemover(props.product.id);

  return (
    <ProductCard {...props}>
      <Protected.Fragment minRole="Admin">
        <Group justify="space-between">
          <Anchor href={`/products/edit/${props.product.id}`} underline="never">
            <Button variant="outline" color="lime">
              Edit
            </Button>
          </Anchor>
          <Button
            onClick={() => props.openDeleteModal(props.product.id)}
            variant="outline"
            color="red"
          >
            Delete
          </Button>
        </Group>
        <Modal onClose={props.cancelDeleteModal} opened={props.deletingId === props.product.id}>
          <Center pb={16}>
            <Stack>
              <ProductCard {...props} />
              <Center>
                <Button
                  onClick={remove}
                  disabled={status === 'pending'}
                  variant="filled"
                  my={16}
                  color="red"
                  fullWidth
                >
                  Delete
                </Button>
                {error && (
                  <Text c="red" fw="bold">
                    {error}
                  </Text>
                )}
              </Center>
            </Stack>
          </Center>
        </Modal>
      </Protected.Fragment>
    </ProductCard>
  );
};
