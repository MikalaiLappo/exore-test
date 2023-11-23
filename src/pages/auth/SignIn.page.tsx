/* eslint-disable import/extensions */
import { Anchor, Button, Card, Group, Stack, TextInput, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useEffect } from 'react';
import { AuthLayout } from './auth.layout';
import { SignInUserData } from '@/types/users';
import { useSignIn } from '@/store/hooks.mjs';

const signInValidator = z.object({
  login: z.string().min(4, { message: 'Login should have at least 4 letters' }),
  password: z.string().min(8, { message: 'Password should have at least 8 characters' }),
});

const defaultSignInData: SignInUserData = {
  login: '',
  password: '',
};

export const SignInPage = () => {
  const form = useForm<SignInUserData>({
    validate: zodResolver(signInValidator),
    initialValues: defaultSignInData,
  });

  const [trySignIn, { error, status }] = useSignIn();

  useEffect(() => {
    if (error !== null && !('unknown' in error)) {
      form.setErrors(error);
    }
  }, [error]);

  return (
    <AuthLayout>
      <Card style={{ maxWidth: '32rem' }} w="100%">
        <form onSubmit={form.onSubmit((values) => trySignIn(values))}>
          <Stack>
            <TextInput label="Login" placeholder="Login" mt="md" {...form.getInputProps('login')} />
            <TextInput
              label="Password"
              placeholder="Password"
              type="password"
              mt="md"
              {...form.getInputProps('password')}
            />
            <Group justify="space-between" px={16}>
              <Button type="submit" disabled={status === 'pending'} color="indigo" mt="md">
                Sign In
              </Button>
              <Anchor href="/auth/sign-up">
                <Button type="button" color="indigo" mt="md">
                  Sign Up?
                </Button>
              </Anchor>
            </Group>
            <Text c="red">{error !== null && 'unknown' in error ? error.unknown : null}</Text>
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  );
};
