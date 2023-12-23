import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { ExtUser, SmUser, User } from './user.model';
import { EditUserPasswordDto, UpdateUserRoleDto } from './user.dto';
import { getQuery } from '../../common/utils';

export const usersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users?${getQuery(req)}`,
      }),
      providesTags: ['User', 'City', 'Friend'],
    }),
    getMyUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend'],
    }),
    getAllUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend'],
    }),
    selectAllUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/all/select',
      }),
      providesTags: ['User'],
    }),
    selectNotCitizensUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-citizens/select',
      }),
      providesTags: ['User', 'City'],
    }),
    selectNotFriendsUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-friends/select',
      }),
      providesTags: ['Auth', 'User', 'Friend'],
    }),
    selectNotFollowingsUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-followings/select',
      }),
      providesTags: ['Auth', 'User', 'Following'],
    }),
    selectNotRatedUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-rated/select',
      }),
      providesTags: ['Auth', 'User', 'Rating'],
    }),
    getSingleUser: build.query<ExtUser, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
      providesTags: ['User', 'City', 'Friend'],
    }),
    editUserPassword: build.mutation<void, EditUserPasswordDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/password`,
        method: 'PATCH',
        body: dto,
      }),
    }),
    addUserRole: build.mutation<void, UpdateUserRoleDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/roles`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['User'],
    }),
    removeUserRole: build.mutation<void, UpdateUserRoleDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/roles`,
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
  useSelectNotFollowingsUsersQuery,
  useSelectNotRatedUsersQuery,
  useGetSingleUserQuery,
  useEditUserPasswordMutation,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
} = usersApi;
