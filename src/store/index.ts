import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistCombineReducers,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productsReducer from './slices/productsSlice';
import usersReducer from './slices/usersSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

export const persistedReducers = persistCombineReducers(persistConfig, {
  productsStore: productsReducer,
  usersStore: usersReducer,
});

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
