/* eslint-disable import/extensions */
import { Center, Container } from '@mantine/core';
import { ReactNode } from 'react';
import { Protected } from '@/core/Protected';
import { UserRole } from '@/types/users';

type ProductsLayoutProps = { children: ReactNode; minRole?: UserRole; overRole?: UserRole };
export const ProductsLayout = ({
  children,
  minRole = 'Customer',
  overRole,
}: ProductsLayoutProps) => (
  <Protected.Redirect minRole={minRole} overRole={overRole} path="/auth/sign-in">
    <Container fluid>
      <Center>{children}</Center>
    </Container>
  </Protected.Redirect>
);
