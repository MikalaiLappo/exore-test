/* eslint-disable import/extensions */
import {
  Stack,
  Flex,
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Center,
  Container,
  SegmentedControl,
  Group,
} from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { ProductFullCard } from './ProductFullCard';
import { ProductCard } from './ProductCard';
import { Product, ProductStatus } from '@/types/products';

const newProductValidator = z.object({
  title: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  description: z.string().min(16, { message: 'Description should have at least 16 letters' }),
  price: z.number().min(1).max(9999),
  category: z.string().min(6),
  image: z.string().url(),
});
type ProductFormProps = {
  product: Product;
  onSubmit: (p: Product) => void;
  buttonText: string;
};

export const ProductForm = ({ buttonText, onSubmit, product }: ProductFormProps) => {
  const form = useForm<Product>({
    validate: zodResolver(newProductValidator),
    initialValues: product,
  });

  // Edge-case for complete uncrolled input deletion
  const safePrice: number = form.getInputProps('price').value || 0;
  const previewData = { ...product, ...form.values, ...{ price: safePrice } };

  console.log(previewData);
  return (
    <Container size="xl" pt={32}>
      <Stack>
        <Flex justify="center" gap="xl">
          <Card style={{ maxWidth: '32rem' }} w="100%">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                label="Title"
                placeholder="Title"
                mt="md"
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Description"
                placeholder="Description"
                mt="md"
                minRows={3}
                autosize
                {...form.getInputProps('description')}
              />
              <NumberInput
                w={180}
                min={1}
                label="Price"
                placeholder="Price"
                mt="md"
                leftSection={<>$</>}
                {...form.getInputProps('price')}
              />
              <TextInput
                label="Image URL"
                placeholder="Image"
                mt="md"
                {...form.getInputProps('image')}
              />
              <TextInput
                label="Category"
                placeholder="Category"
                mt="md"
                {...form.getInputProps('category')}
              />
              <SegmentedControl
                fullWidth
                my={8}
                data={
                  [
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Live', label: 'Live' },
                  ] as { value: ProductStatus; label: ProductStatus }[]
                }
                value={form.getInputProps('status').value as ProductStatus}
                onChange={(val) => form.setFieldValue('status', val as ProductStatus)}
              />
              <Button
                variant="gradient"
                gradient={{ from: 'green', to: 'blue' }}
                type="submit"
                mt="md"
              >
                {buttonText}
              </Button>
            </form>
          </Card>
          <Group>
            <ProductCard product={previewData} />
          </Group>
        </Flex>
        <Center>
          <ProductFullCard product={previewData} />
        </Center>
      </Stack>
    </Container>
  );
};
