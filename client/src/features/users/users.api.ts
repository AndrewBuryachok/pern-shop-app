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
      providesTags: ['Active', 'User', 'Card', 'Friend'],
    }),
    getMyUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'Card', 'Friend'],
    }),
    getAllUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'Card', 'Friend'],
    }),
    selectAllUsers: build.query<SmUserWithCity[], void>({
      query: () => ({
        url: '/users/all/select',
      }),
      providesTags: ['Active', 'User'],
    }),
    selectNotCitizensUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-citizens/select',
      }),
      providesTags: ['Active', 'User'],
    }),
    selectNotFriendsUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-friends/select',
      }),
      providesTags: ['Auth', 'User', 'Friend'],
    }),
    getSingleUser: build.query<ExtUser, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
      providesTags: [
        'Active',
        'User',
        'Card',
        'Good',
        'Ware',
        'Product',
        'Trade',
        'Sale',
        'Friend',
      ],
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
      invalidatesTags: ['User'],
    }),
    removeUserCity: build.mutation<void, UpdateUserCityDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/city`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetMainUsersQuery,
  useGetMyUsersQuery,
  useGetAllUsersQuery,
  useSelectAllUsersQuery,
  useSelectNotCitizensUsersQuery,
  useSelectNotFriendsUsersQuery,
  useGetSingleUserQuery,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
  useAddUserCityMutation,
  useRemoveUserCityMutation,
} = usersApi;
