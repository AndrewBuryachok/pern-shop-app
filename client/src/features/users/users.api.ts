import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { ExtUser, SmUser, User } from './user.model';
import {
  EditUserPasswordDto,
  EditUserProfileDto,
  RankUserDto,
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
    getTopUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/top?${getQuery(req)}`,
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
    getIgnorersUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/ignorers?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Ignorer'],
    }),
    getRatingsUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/ratings?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Rating'],
    }),
    getRanksUsers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/users/ranks?${getQuery(req)}`,
      }),
      providesTags: ['User', 'Rank'],
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
    selectNotIgnoredUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-ignored/select',
      }),
      providesTags: ['Auth', 'User', 'Ignorer'],
    }),
    selectNotRatedUsers: build.query<SmUser[], void>({
      query: () => ({
        url: '/users/not-rated/select',
      }),
      providesTags: ['Auth', 'User', 'Rating'],
    }),
    getSingleUser: build.query<ExtUser, string>({
      query: (nick) => ({
        url: `/users/${nick}`,
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
    getMyRanks: build.query<
      { rank1: boolean; rank2: boolean; rank3: boolean; rank4: boolean },
      void
    >({
      query: () => ({
        url: '/users/me/ranks',
      }),
      providesTags: ['Auth', 'Rank'],
    }),
    addMyRank: build.mutation<void, RankUserDto>({
      query: (dto) => ({
        url: '/users/me/ranks',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Rank'],
    }),
  }),
});

export const {
  useGetMainUsersQuery,
  useGetTopUsersQuery,
  useGetFriendsUsersQuery,
  useGetSubscribersUsersQuery,
  useGetIgnorersUsersQuery,
  useGetRatingsUsersQuery,
  useGetRanksUsersQuery,
  useGetMyUsersQuery,
  useGetAllUsersQuery,
  useSelectAllUsersQuery,
  useSelectNotCitizensUsersQuery,
  useSelectNotFriendsUsersQuery,
  useSelectNotSubscribedUsersQuery,
  useSelectNotIgnoredUsersQuery,
  useSelectNotRatedUsersQuery,
  useGetSingleUserQuery,
  useEditUserProfileMutation,
  useEditUserPasswordMutation,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
  useGetMyRanksQuery,
  useAddMyRankMutation,
} = usersApi;
