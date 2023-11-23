/* eslint-disable import/extensions */
import { Anchor, Button, Card, Group, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { AuthLayout } from './auth.layout';
import { User } from '@/types/users';
import { useSignIn } from '@/store/hooks.mjs';

const signInValidator = z.object({
  login: z.string().min(4, { message: 'Login should have at least 4 letters' }),
  password: z.string().min(8, { message: 'Password should have at least 8 characters' }),
});

type SignInUserData = Pick<User, 'login' | 'password'>;

const defaultSignInData: SignInUserData = {
  login: '',
  password: '',
};

export const SignInPage = () => {
  const form = useForm<SignInUserData>({
    validate: zodResolver(signInValidator),
    initialValues: defaultSignInData,
  });

  const trySignIn = useSignIn();

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
              <Button type="submit" color="indigo" mt="md">
                Sign In
              </Button>
              <Anchor href="/auth/sign-up">
                <Button type="button" color="indigo" mt="md">
                  Sign Up?
                </Button>
              </Anchor>
            </Group>
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  );
};
