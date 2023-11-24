/* eslint-disable import/extensions */
import { Anchor, Button, Menu, rem } from '@mantine/core';
import {
  IconFilePlus,
  IconHome,
  IconLogin,
  IconLogout,
  IconNotes,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useLogOut, useSession } from '@/store/hooks.mjs';
import { User } from '@/types/users';

const GuestMenu = () => (
  <Menu>
    <Menu.Target>
      <Button variant="outline" color="cyan">
        Guest
      </Button>
    </Menu.Target>

    <Menu.Label>Account</Menu.Label>

    <Anchor underline="never" href="/auth/sign-in">
      <Menu.Item leftSection={<IconLogin style={{ width: rem(20), height: rem(20) }} />}>
        Sign In
      </Menu.Item>
    </Anchor>

    <Anchor underline="never" href="/auth/sign-up">
      <Menu.Item rightSection={<IconUser style={{ width: rem(20), height: rem(20) }} />}>
        Sign Up
      </Menu.Item>
    </Anchor>
  </Menu>
);

const CustomerMenu = ({ user, children }: { user: User; children?: ReactNode }) => {
  const logOut = useLogOut();

  return (
    <Menu>
      <Menu.Target>
        <Button variant="outline" color="lime">
          {user.login}
        </Button>
      </Menu.Target>

      <Menu.Label>Market</Menu.Label>
      <Anchor underline="never" href="/">
        <Menu.Item leftSection={<IconHome style={{ width: rem(20), height: rem(20) }} />}>
          Home
        </Menu.Item>
      </Anchor>
      <Anchor underline="never" href="/products">
        <Menu.Item leftSection={<IconShoppingBag style={{ width: rem(20), height: rem(20) }} />}>
          Products
        </Menu.Item>
      </Anchor>

      {children}

      <Menu.Divider />
      <Menu.Label>Account</Menu.Label>
      <Menu.Item
        rightSection={<IconLogout style={{ width: rem(20), height: rem(20) }} />}
        onClick={() => logOut()}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

const AdminMenu = ({ user }: { user: User }) => (
  <CustomerMenu user={user}>
    <Menu.Divider />

    <Menu.Label>Admin</Menu.Label>

    <Anchor underline="never" href="/products/add">
      <Menu.Item leftSection={<IconFilePlus style={{ width: rem(20), height: rem(20) }} />}>
        New Product
      </Menu.Item>
    </Anchor>

    <Anchor underline="never" href="/products?status=draft">
      <Menu.Item leftSection={<IconNotes style={{ width: rem(20), height: rem(20) }} />}>
        Drafts
      </Menu.Item>
    </Anchor>
  </CustomerMenu>
);

/* Would be more usefull if there'll be more roles
const roleMenus: {
    [k in UserRole]: React.ComponentType<any>;
  } = {
    Guest: GuestMenu,
    Admin: AdminMenu,
    Customer: CustomerMenu,
  };
*/

export const MobileMenu = () => {
  const { user } = useSession();
  if (user === null) {
    return <GuestMenu />;
  }
  if (user.role === 'Admin') return <AdminMenu user={user} />;
  return <CustomerMenu user={user} />;
};
