/* eslint-disable import/extensions */
import { Anchor, Button, Card, Group, SegmentedControl, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useEffect } from 'react';
import { NewUserData, UserRole } from '@/types/users.js';
import { AuthLayout } from './auth.layout';
import { useSignUp } from '@/store/hooks.mjs';

const newUserValidator = z.object({
  login: z.string().min(4, { message: 'Login should have at least 2 letters' }),
  password: z.string().min(8, { message: 'Password should have at least 8 characters' }),
  role: z.enum(['Customer', 'Admin']),
});

const defaultProductData: NewUserData = {
  login: '',
  password: '',
  role: 'Admin',
};

export const SignUpPage = () => {
  const form = useForm<NewUserData>({
    validate: zodResolver(newUserValidator),
    initialValues: defaultProductData,
  });

  const [trySignUp, { error, status }] = useSignUp();

  useEffect(() => {
    if (error !== null && !('unknown' in error)) {
      form.setErrors(error);
    }
  }, [error]);

  return (
    <AuthLayout>
      <Card style={{ maxWidth: '32rem' }} pb={36} w="100%">
        <form onSubmit={form.onSubmit((values) => trySignUp(values))}>
          <Stack>
            <TextInput
              label="Login"
              placeholder="Minimum of 4 chars"
              mt="md"
              {...form.getInputProps('login')}
            />
            <TextInput
              label="Password"
              placeholder="Minimum of 8 chars"
              type="password"
              mt="md"
              {...form.getInputProps('password')}
            />
            <SegmentedControl
              data={
                [
                  { value: 'Customer', label: 'Customer' },
                  { value: 'Admin', label: 'Admin' },
                ] as { value: UserRole; label: UserRole }[]
              }
              value={form.getInputProps('role').value as UserRole}
              onChange={(val) => form.setFieldValue('role', val as UserRole)}
            />
            <Group justify="space-between" px={16}>
              <Button disabled={status === 'pending'} type="submit" color="indigo" mt="md">
                Sign Up
              </Button>
              <Anchor href="/auth/sign-in">
                <Button type="button" color="indigo" mt="md">
                  Sign In?
                </Button>
              </Anchor>
            </Group>
            {error && 'unknown' in error ? error.unknown : null}
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  );
};
