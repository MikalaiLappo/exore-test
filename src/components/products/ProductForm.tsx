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
} from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { ProductFullCard } from './ProductFullCard';
import { ProductCard } from './ProductCard';
import { NewProduct, Product } from '@/types/products';

const newProductValidator = z.object({
  title: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  description: z.string().min(16, { message: 'Description should have at least 16 letters' }),
  price: z.number().min(1).max(9999),
  category: z.string().min(6),
  image: z.string().url(),
});

const productStubData: Pick<Product, 'rating' | 'id'> = {
  rating: { rate: 4.7, count: 538 },
  id: -1,
};

const now = Date.now();

const defaultProductData = {
  title: 'Mens Casual Premium Slim Fit T-Shirts ',
  price: 22.3,
  description:
    'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  source: 'Local',
  status: 'Draft',
  createdAt: now,
  updatedAt: now,
  isDeleted: false,
} as const;

type ProductFormProps = {
  onSubmit: (p: NewProduct) => void;
  buttonText: string;
};

export const ProductForm = ({ buttonText, onSubmit }: ProductFormProps) => {
  const form = useForm<NewProduct>({
    validate: zodResolver(newProductValidator),
    initialValues: defaultProductData,
  });

  // Edge-case for complete uncrolled input deletion
  const safePrice: number = form.getInputProps('price').value || 0;
  const previewData = { ...form.values, ...productStubData, ...{ price: safePrice } };

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
          <ProductCard product={previewData} />
        </Flex>
        <Center>
          <ProductFullCard product={previewData} />
        </Center>
      </Stack>
    </Container>
  );
};
