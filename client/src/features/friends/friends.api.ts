import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Friend } from './friend.model';
import { CreateFriendDto, UpdateFriendDto } from './friend.dto';
import { getQuery } from '../../common/utils';

export const friendsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainFriends: build.query<IResponse<Friend>, IRequest>({
      query: (req) => ({
        url: `/friends?${getQuery(req)}`,
      }),
      providesTags: ['Active', 'Friend'],
    }),
    getMyFriends: build.query<IResponse<Friend>, IRequest>({
      query: (req) => ({
        url: `/friends/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Friend'],
    }),
    getAllFriends: build.query<IResponse<Friend>, IRequest>({
      query: (req) => ({
        url: `/friends/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Friend'],
    }),
    createFriend: build.mutation<void, CreateFriendDto>({
      query: (dto) => ({
        url: '/friends',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Friend'],
    }),
    addFriend: build.mutation<void, UpdateFriendDto>({
      query: ({ friendId }) => ({
        url: `/friends/${friendId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friend'],
    }),
    removeFriend: build.mutation<void, UpdateFriendDto>({
      query: ({ friendId }) => ({
        url: `/friends/${friendId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Friend'],
    }),
  }),
});

export const {
  useGetMainFriendsQuery,
  useGetMyFriendsQuery,
  useGetAllFriendsQuery,
  useCreateFriendMutation,
  useAddFriendMutation,
  useRemoveFriendMutation,
} = friendsApi;
