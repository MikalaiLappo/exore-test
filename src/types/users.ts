export type User = {
  id: number;
  login: string;
  password: string;
  role: UserRole;
};

export type UserRole = 'Customer' | 'Admin' | 'Guest';

export type NewUserData = Omit<User, 'id'>;
export type SignInUserData = Pick<User, 'login' | 'password'>;

export type SessionToken = string;

export type UserFormError = { login: string } | { password: string } | { unknown: string };
