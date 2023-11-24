/* eslint-disable import/extensions */
import { IconCurrencyDollar } from '@tabler/icons-react';
import {
  Button,
  Container,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Text,
  SegmentedControl,
  Flex,
} from '@mantine/core';
import { Protected } from '@/core/Protected';
import { ProductStatus } from '@/types/products';

type ProductFiltersProps = {
  allCategories: string[];
  categories: string[];
  setCategories: (cs: string[]) => void;
  minPrice: number;
  setMinPrice: (mp: number) => void;
  maxPrice: number;
  setMaxPrice: (mp: number) => void;
  text: string;
  setText: (s: string) => void;
  minRating: string;
  setMinRating: (s: string) => void;
  minReviews: number;
  setMinReviews: (mr: number) => void;
  status: ProductStatus;
  setStatus: (ps: ProductStatus) => void;
};
export const ProductFilters = ({
  allCategories,
  categories,
  setCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  text,
  setText,
  minRating,
  setMinRating,
  minReviews,
  setMinReviews,
  status,
  setStatus,
}: ProductFiltersProps) => (
  <Container maw={480} py={36}>
    <Stack>
      <Protected.Fragment minRole="Admin">
        <Flex>
          <SegmentedControl
            fullWidth
            data={
              [
                { label: 'Live', value: 'Live' },
                { label: 'Draft', value: 'Draft' },
              ] as { label: ProductStatus; value: ProductStatus }[]
            }
            value={status}
            onChange={(v) => setStatus(v as ProductStatus)}
          />
        </Flex>
      </Protected.Fragment>
      <TextInput
        label="Text search"
        placeholder="Product name or description"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <Group gap={8}>
        <NumberInput
          w={128}
          hideControls
          leftSection={<IconCurrencyDollar />}
          placeholder="Min price"
          value={minPrice || ''}
          onChange={(n) => setMinPrice(+n || 0)}
        />
        <NumberInput
          w={128}
          hideControls
          placeholder="Max price"
          value={maxPrice || ''}
          onChange={(n) => setMaxPrice(+n || Infinity)}
        />
      </Group>
      <Group>
        <TextInput
          w={80}
          placeholder="Rating"
          value={
            minRating === '0' || minRating === ''
              ? ''
              : minRating.endsWith('.')
              ? minRating
              : Math.min(+minRating, 5)
          }
          onChange={(e) => {
            const strval = e.target.value;
            if (strval === '') {
              setMinRating('');
              return;
            }
            if (!/^[0-5](\.\d?)?$/.test(strval)) return;
            if (/^5\.$/.test(strval)) return;
            if (strval.endsWith('.')) {
              setMinRating(strval);
              return;
            }
            setMinRating(Math.min(+strval || 0, 5).toFixed(1));
          }}
        />
        <TextInput
          w={120}
          placeholder="Reviews"
          value={minReviews === 0 ? '' : minReviews}
          onChange={(e) => setMinReviews(+e.target.value || 0)}
        />
      </Group>
      <Group>
        {allCategories.map((c, i) => (
          <Button
            key={c + i}
            variant="outline"
            color={categories.includes(c) ? 'orange' : 'grey'}
            onClick={() =>
              setCategories(
                categories.includes(c) ? categories.filter((cat) => cat !== c) : [...categories, c]
              )
            }
          >
            {c}
          </Button>
        ))}
        {!allCategories.length ? (
          <Group>
            <Text c="orange" fw="bold">
              There is 0 {status} products
            </Text>
          </Group>
        ) : !categories.length ? (
          <Group>
            <Text c="red" fw="bold">
              Select at least some Category
            </Text>
          </Group>
        ) : null}
      </Group>
    </Stack>
  </Container>
);
