import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { ExtUser, SmUser, User } from './user.model';
import {
  EditUserPasswordDto,
  EditUserProfileDto,
  UpdateUserRoleDto,
} from './user.dto';
import { getQuery } from '../../common/utils';

export const usersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users?${getQuery(req)}`,
      }),
      providesTags: ['User'],
    }),
    getFriendsUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/friends?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Friend'],
    }),
    getSubscribersUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/subscribers?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Subscriber'],
    }),
    getRatingsUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/ratings?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Rating'],
    }),
    getMyUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User'],
    }),
    getAllUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User'],
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
      providesTags: ['User'],
    }),
    selectNotFriendsUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-friends/select',
      }),
      providesTags: ['Auth', 'User', 'Friend'],
    }),
    selectNotSubscribedUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-subscribed/select',
      }),
      providesTags: ['Auth', 'User', 'Subscriber'],
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
      providesTags: ['User'],
    }),
    editUserProfile: build.mutation<void, EditUserProfileDto>({
      query: ({ userId, ...dto }) => ({
        url: `/users/${userId}/profile`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['User'],
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
  useGetFriendsUsersQuery,
  useGetSubscribersUsersQuery,
  useGetRatingsUsersQuery,
  useGetMyUsersQuery,
  useGetAllUsersQuery,
  useSelectAllUsersQuery,
  useSelectNotCitizensUsersQuery,
  useSelectNotFriendsUsersQuery,
  useSelectNotSubscribedUsersQuery,
  useSelectNotRatedUsersQuery,
  useGetSingleUserQuery,
  useEditUserProfileMutation,
  useEditUserPasswordMutation,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
} = usersApi;
