/* eslint-disable import/extensions */
import { Center, Container } from '@mantine/core';
import { ReactNode } from 'react';
import { Protected } from '@/core/Protected';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <Protected.Redirect minRole="Guest" overRole="Customer" path="/products">
    <Container size="xl" p="xl">
      <Center>{children}</Center>
    </Container>
  </Protected.Redirect>
);
