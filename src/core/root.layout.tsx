/* eslint-disable import/extensions */
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import cn from 'classnames';
import { Outlet } from 'react-router-dom';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import styles from './rootLayout.module.css';
import { AccountMenu } from '@/components/auth/AccountMenu';

const MobileHeaderContent = ({
  opened,
  toggle,
  children,
}: {
  opened: boolean;
  toggle: () => void;
  children?: ReactNode;
}) => (
  <Group className={cn(styles.header__content, styles.header__content_mobile)} hiddenFrom="sm">
    <Burger opened={opened} onClick={toggle} size="sm" />
    {children}
    <ColorSchemeToggle />
  </Group>
);

const DesktopHeaderContent = ({ children }: { children?: ReactNode }) => (
  <Group className={cn(styles.header__content, styles.header__content_desktop)}>
    {children}
    <AccountMenu />
    <ColorSchemeToggle />
  </Group>
);

const RootLayout = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: true } }}
    >
      <AppShell.Header className={styles.header}>
        <MobileHeaderContent opened={opened} toggle={toggle} />
        <DesktopHeaderContent />
        <AppShell.Navbar className={styles.header__navbar}>Navbar</AppShell.Navbar>
      </AppShell.Header>

      <AppShell.Main h="100%">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export { RootLayout };
