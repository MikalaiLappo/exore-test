/* eslint-disable import/extensions */
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/store/hooks.mjs';
import { UserRole } from '@/types/users';

const roleValues: {
  [k in UserRole]: number;
} = {
  Admin: Infinity,
  Customer: 1,
  Guest: -1,
};

type GeneralProtected = {
  children: ReactNode;
  minRole: UserRole;
};

type ProtectedRouteProps = GeneralProtected & {
  ForbiddenComponent: React.ComponentType<{}>;
};

const ProtectedRoute = ({ children, minRole, ForbiddenComponent }: ProtectedRouteProps) => {
  const { user } = useSession();
  if (user === null) return <ForbiddenComponent />;
  if (roleValues[user.role] < roleValues[minRole]) return <ForbiddenComponent />;
  return { children };
};

type ProtectedFragmentProps = GeneralProtected;
const ProtectedFragment = ({ children, minRole }: ProtectedFragmentProps) => {
  const { user } = useSession();
  if (user === null) return null;
  if (roleValues[user.role] < roleValues[minRole]) return null;
  return <>{children}</>;
};

type ProtectedRoleFragmentProps = { Guest?: ReactNode } & {
  [k in keyof typeof roleValues]: ReactNode;
};
const ProtectedRoleFragment = ({ Guest, Admin, Customer }: ProtectedRoleFragmentProps) => {
  const { user } = useSession();
  if (!user) return Guest;
  if (user.role === 'Admin') return Admin;
  return Customer;
};

type ProtectedRedirectProps = GeneralProtected & {
  path: string;
  overRole?: UserRole;
};
const ProtectedRedirect = ({ children, minRole, path, overRole }: ProtectedRedirectProps) => {
  const { user } = useSession();

  const role = user?.role || 'Guest';

  if (
    roleValues[role] < roleValues[minRole] ||
    (overRole && roleValues[role] >= roleValues[overRole])
  ) {
    return <Navigate replace to={path} />;
  }
  return <>{children}</>;
};

export const Protected = {
  Route: ProtectedRoute,
  Fragment: ProtectedFragment,
  RoleFragment: ProtectedRoleFragment,
  Redirect: ProtectedRedirect,
};
