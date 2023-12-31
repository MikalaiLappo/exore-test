/* eslint-disable import/extensions */
import { Title, Text, Stack, Group, Anchor, Container, rem, Divider } from '@mantine/core';
import { useAppSelector, useProductsRetriever } from '@/store/hooks.mjs';
import { CategoryButton } from '@/components/products/atoms/CategoryButton';
import { Protected } from '@/core/Protected';

const Welcome = () => (
  <Title style={{ fontSize: 68 }} ta="center">
    Welcome to the <br />
    <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
      Market
    </Text>
  </Title>
);

const Stats = () => {
  const [products] = useProductsRetriever();
  const ps = products.filter((p) => !p.isDeleted && p.status === 'Live');
  const categories = [...new Set(ps.map((p) => p.category))];
  return (
    <Stack mt={40}>
      <Text>Public Stats</Text>
      <Text fz={28}>
        Total{' '}
        <Anchor fz={28} href="/products">
          products
        </Anchor>
        : <span style={{ color: 'darkcyan' }}>{ps.filter((p) => p.status === 'Live').length}</span>
      </Text>
      <Text fz={28}>
        In <span style={{ color: 'orange' }}>{categories.length}</span> categories:{' '}
      </Text>
      <Group>
        {categories.map((c, i) => (
          <CategoryButton isLink key={c + i} category={c} />
        ))}
      </Group>
    </Stack>
  );
};

const AdminStats = () => {
  const { products } = useAppSelector((state) => state.productsStore);
  const draftProducts = products.filter((p) => !p.isDeleted && p.status === 'Draft');
  const softDeleted = products.filter((p) => p.isDeleted);

  return (
    <Stack>
      <Text fs="italic" fw="bold" fz={20}>
        Admin Stats
      </Text>
      <Group>
        <Anchor href="products?status=Draft" fz={28}>
          Draft
        </Anchor>
        <Text fz={28}> products: {draftProducts.length.toString()}</Text>
      </Group>
      <Text fz={28}> Soft deleted count (API): {softDeleted.length.toString()}</Text>
    </Stack>
  );
};

export const HomePage = () => (
  <Container size="md" p={rem(40)}>
    <Stack justify="center">
      <Welcome />
      <Protected.RoleFragment
        Guest={
          <Anchor fz={24} href="/auth/sign-in" mt="xl" ta="center" fs="italic" td="underline">
            Sign in to view products
          </Anchor>
        }
        Customer={<Stats />}
        Admin={
          <Stack gap={40}>
            <Stats />
            <Divider />
            <AdminStats />
          </Stack>
        }
      />
    </Stack>
  </Container>
);
