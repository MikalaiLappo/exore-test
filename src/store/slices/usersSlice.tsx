/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NewUserData, User } from '@/types/users.js';

export const signUp = createAsyncThunk('users/signUp', async (userData: NewUserData) => userData);

type SessionStorage = {
  [key: string]: {
    userId: number;
    expiration: number;
  };
};

type ProductsState = {
  users: User[];
  sessions: SessionStorage;
  token: string | null;
};

const initialState: ProductsState = {
  users: [],
  sessions: {},
  token: null,
};

const createSessionToken = () => {
  const tokenish = Date.now();
  const exp = new Date();
  exp.setDate(exp.getDate() + 1);

  return {
    token: tokenish.toString(),
    expiration: +exp,
  };
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<Pick<User, 'login' | 'password'>>) => {
      const theUser = state.users.find((u) => u.login === action.payload.login);
      if (!theUser) {
        // edge-case
        if (state.token) {
          delete state.sessions[state.token];
        }
        state.token = null;
        return;
      }

      const { token, expiration } = createSessionToken();

      state.token = token;
      state.sessions[token] = {
        expiration,
        userId: theUser.id,
      };
    },
    validateToken: (state) => {
      if (state.token === null) return;
      if (!state.sessions[state.token]) {
        state.token = null;
      }
    },
    signOut: (state) => {
      if (!state.token) return;
      delete state.sessions[state.token];
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (state.users.find((u) => u.login === action.payload.login)) {
        // `login` already exists
        return;
      }

      const userId = state.users.length;
      state.users.push({
        ...action.payload,
        id: userId,
      });

      const { token, expiration } = createSessionToken();
      state.token = token;
      state.sessions[token] = {
        expiration,
        userId,
      };
    });
  },
});

export const { signIn, signOut, validateToken } = usersSlice.actions;

export default usersSlice.reducer;
