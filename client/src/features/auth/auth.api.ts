import { emptyApi } from '../../app/empty.api';
import { Tokens } from './auth.model';
import { AuthDto, UpdatePasswordDto } from './auth.dto';

export const authApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<Tokens, AuthDto>({
      query: (dto) => ({
        url: '/auth/register',
        method: 'POST',
        body: dto,
      }),
    }),
    login: build.mutation<Tokens, AuthDto>({
      query: (dto) => ({
        url: '/auth/login',
        method: 'POST',
        body: dto,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    updatePassword: build.mutation<void, UpdatePasswordDto>({
      query: (dto) => ({
        url: '/auth/password',
        method: 'PATCH',
        body: dto,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdatePasswordMutation,
} = authApi;
