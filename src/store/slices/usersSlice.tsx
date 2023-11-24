/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NewUserData, SessionToken, SignInUserData, User, UserFormError } from '@/types/users.js';
import { ProcessStatus } from '@/types/shared';

export const signUp = createAsyncThunk<
  NewUserData,
  NewUserData,
  { state: { usersStore: UsersState }; rejectValue: UserFormError }
>(
  'users/signUp',
  async (userData, { getState, rejectWithValue /*requestId, rejectWithValue*/ }) => {
    const { users } = getState().usersStore;

    const sameLoginUser = users.find((u) => u.login === userData.login);
    if (sameLoginUser !== undefined) {
      return rejectWithValue({ login: 'Login already taken' });
    }

    return userData;
  }
);

type TokenPayload = {
  token: SessionToken;
  expiration: number;
};
const createSessionToken = (): TokenPayload => {
  const tokenish = Date.now();
  const exp = new Date();
  exp.setDate(exp.getDate() + 1);

  return {
    token: tokenish.toString(),
    expiration: +exp,
  };
};

export const signIn = createAsyncThunk<
  TokenPayload & { userId: number },
  SignInUserData,
  { state: { usersStore: UsersState }; rejectValue: UserFormError }
>(
  'users/signIn',
  async (userData, { getState, rejectWithValue /*requestId, rejectWithValue*/ }) => {
    const { users } = getState().usersStore;

    const user = users.find((u) => u.login === userData.login);
    if (user === undefined) {
      return rejectWithValue({ login: 'Login not found' });
    }

    if (user.password !== userData.password) {
      return rejectWithValue({ password: 'Wrong password' });
    }

    return { ...createSessionToken(), userId: user.id };
  }
);

type SessionStorage = {
  [key: string]: {
    userId: number;
    expiration: number;
  };
};

type UsersState = {
  users: User[];
  sessions: SessionStorage;
  token: SessionToken | null;
  signUpStatus: ProcessStatus;
  signUpError: null | UserFormError;
  signInStatus: ProcessStatus;
  signInError: null | UserFormError;
};

const initialState: UsersState = {
  users: [],
  sessions: {},
  token: null,
  /* In real world app I'd probably handle it with some react-query lib, beside Redux
    It's only a mock-stub-ish workaround since there is no API, and adding stuff like Auth0 is too much
  */
  signUpStatus: 'idle',
  signUpError: null,
  signInStatus: 'idle',
  signInError: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
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
    initSignIn: (state) => {
      state.signInError = null;
      state.signInStatus = 'idle';
    },
    initSignUp: (state) => {
      state.signUpError = null;
      state.signUpStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
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

        state.signUpError = null;
        state.signUpStatus = 'succeeded';
      })
      .addCase(signUp.pending, (state) => {
        state.signUpStatus = 'pending';
        state.signUpError = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpStatus = 'failed';
        state.signUpError = action.payload ?? {
          unknown: action.error.message ?? 'Unknown error',
        };
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.sessions[action.payload.token] = {
          expiration: action.payload.expiration,
          userId: action.payload.userId,
        };

        state.signInStatus = 'succeeded';
        state.signInError = null;
      })
      .addCase(signIn.pending, (state) => {
        state.signInStatus = 'pending';
        state.signInError = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        // edge-case
        if (state.token) {
          delete state.sessions[state.token];
        }
        state.token = null;

        state.signInError = action.payload ?? {
          unknown: action.error.message ?? 'Unknown error',
        };
        state.signInStatus = 'failed';
      });
  },
});

export const { signOut, validateToken, initSignIn, initSignUp } = usersSlice.actions;

export default usersSlice.reducer;
