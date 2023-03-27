import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { ExtUser, SmUser, SmUserWithCity, User } from './user.model';
import { UpdateUserCityDto, UpdateUserRolesDto } from './user.dto';
import { getQuery } from '../../common/utils';

export const usersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users?${getQuery(req)}`,
      }),
      providesTags: ['User'],
    }),
    getMyUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/my?${getQuery(req)}`,
      }),
      providesTags: ['User'],
    }),
    getAllUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/all?${getQuery(req)}`,
      }),
      providesTags: ['User'],
    }),
    selectAllUsers: build.query<SmUserWithCity[], void>({
      query: () => ({
        url: '/users/all/select',
      }),
      providesTags: ['User'],
    }),
    selectFreeUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/free/select',
      }),
      providesTags: ['User'],
    }),
    getSingleUser: build.query<ExtUser, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
      providesTags: ['User'],
    }),
    addUserRole: build.mutation<void, UpdateUserRolesDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/roles`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['User'],
    }),
    removeUserRole: build.mutation<void, UpdateUserRolesDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/roles`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['User'],
    }),
    addUserCity: build.mutation<void, UpdateUserCityDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/city`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['User', 'City'],
    }),
    removeUserCity: build.mutation<void, UpdateUserCityDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/city`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['User', 'City'],
    }),
  }),
});

export const {
  useGetMainUsersQuery,
  useGetMyUsersQuery,
  useGetAllUsersQuery,
  useSelectAllUsersQuery,
  useSelectFreeUsersQuery,
  useGetSingleUserQuery,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
  useAddUserCityMutation,
  useRemoveUserCityMutation,
} = usersApi;
