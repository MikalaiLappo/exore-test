export type User = {
  id: number;
  login: string;
  password: string;
  role: UserRole;
};

export type UserRole = 'Customer' | 'Admin' | 'Guest';

export type NewUserData = Omit<User, 'id'>;
