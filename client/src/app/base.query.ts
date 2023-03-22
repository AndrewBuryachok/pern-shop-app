import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { addCurrentUser, removeCurrentUser } from '../features/auth/auth.slice';
import { Tokens } from '../features/auth/auth.model';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user?.access;
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (!result.error || result.error.status !== 401) {
    return result;
  }
  const token = (api.getState() as RootState).auth.user?.refresh;
  if (!token) {
    return result;
  }
  const response = await baseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
    api,
    extraOptions,
  );
  if (!response.data) {
    api.dispatch(removeCurrentUser());
    return result;
  }
  api.dispatch(addCurrentUser(response.data as Tokens));
  return baseQuery(args, api, extraOptions);
};
