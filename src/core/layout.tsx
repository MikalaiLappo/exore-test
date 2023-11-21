/* eslint-disable import/extensions */
import { Anchor, AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import cn from 'classnames';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import layoutStyles from './layout.module.css';

const MobileHeaderContent = ({
  opened,
  toggle,
  children,
}: {
  opened: boolean;
  toggle: () => void;
  children?: ReactNode;
}) => (
  <Group
    className={cn(layoutStyles.header__content, layoutStyles.header__content_mobile)}
    hiddenFrom="sm"
  >
    <Burger opened={opened} onClick={toggle} size="sm" />
    {children}
    <ColorSchemeToggle />
  </Group>
);

const DesktopHeaderContent = ({ children }: { children?: ReactNode }) => (
  <Group className={cn(layoutStyles.header__content, layoutStyles.header__content_desktop)}>
    <Group>
      <Anchor> Home </Anchor>
    </Group>
    {children}
    <ColorSchemeToggle />
  </Group>
);

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: true } }}
    >
      <AppShell.Header className={layoutStyles.header}>
        <MobileHeaderContent opened={opened} toggle={toggle} />
        <DesktopHeaderContent />
        <AppShell.Navbar className={layoutStyles.header__navbar}>Navbar</AppShell.Navbar>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export { RootLayout };
