import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import { emptyApi } from './empty.api';
import { logger } from './logger';

const rootReducer = combineReducers({
  auth: authReducer,
  [emptyApi.reducerPath]: emptyApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptyApi.middleware, logger),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
