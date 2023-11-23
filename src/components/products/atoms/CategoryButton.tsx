import { Button } from '@mantine/core';

export const CategoryButton = ({ category }: { category: string }) => (
  <Button variant="outline" color="orange" radius="md">
    {category}
  </Button>
);
