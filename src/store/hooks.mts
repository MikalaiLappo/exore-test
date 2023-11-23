/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from './index';
import { fetchProducts } from './slices/productsSlice';
import {
  initSignIn,
  initSignUp,
  signIn,
  signOut,
  signUp,
  validateToken,
} from './slices/usersSlice';
import { NewUserData } from '@/types/users';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSession = () => {
  const { token, users, sessions } = useAppSelector((state) => state.usersStore);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!token) return;
    dispatch(validateToken());
  }, [token]);
  if (token === null) return { user: null };
  const thisSession = sessions[token];
  if (!thisSession) return { user: null };

  return { user: users.find((u) => u.id === sessions[token].userId) ?? null };
};

export const useSignUp = () => {
  const dispatch = useAppDispatch();
  const { signUpError, signUpStatus } = useAppSelector((state) => state.usersStore);
  useEffect(() => {
    dispatch(initSignUp());
  }, []);

  const trySignUp = (userData: NewUserData) => dispatch(signUp(userData));

  return [trySignUp, { error: signUpError, status: signUpStatus }] as const;
};

export const useSignIn = () => {
  const dispatch = useAppDispatch();
  const { signInError, signInStatus } = useAppSelector((state) => state.usersStore);
  useEffect(() => {
    dispatch(initSignIn());
  }, []);

  const trySignIn = (logpass: { login: string; password: string }) => dispatch(signIn(logpass));

  return [trySignIn, { error: signInError, status: signInStatus }] as const;
};

export const useLogOut = () => {
  const dispatch = useAppDispatch();
  const logOut = () => dispatch(signOut());
  return logOut;
};

export const useProductsRetriever = () => {
  const { products, productFilters } = useAppSelector((state) => state.productsStore);
  const dispatch = useAppDispatch();

  const loadAPIProducts = async (n?: number) => {
    if (productFilters.status === 'Draft') return;
    /// if (n === undefined && products.length) return;
    dispatch(fetchProducts(n ?? 8));
  };

  useEffect(() => {
    if (productFilters.status === 'Draft') return;
    // if (products.length) return;
    loadAPIProducts();
  }, []);

  return [products, loadAPIProducts] as const;
};
