import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      <ActionIcon size={30} radius="lg" variant="default" onClick={toggleColorScheme}>
        {colorScheme === 'dark' ? '☀️' : '🌙'}
      </ActionIcon>
    </Group>
  );
}
