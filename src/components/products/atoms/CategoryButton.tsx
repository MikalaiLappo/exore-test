import { Anchor, Button } from '@mantine/core';

type CategoryButtonProps = { category: string; isLink?: boolean };
export const CategoryButton = ({ category, isLink }: CategoryButtonProps) =>
  !isLink ? (
    <Button variant="outline" color="orange" radius="md">
      {category}
    </Button>
  ) : (
    <Anchor href={`/products?categories=${category}`}>
      <Button variant="outline" color="orange" radius="md">
        {category}
      </Button>
    </Anchor>
  );
