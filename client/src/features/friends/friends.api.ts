import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { User } from '../users/user.model';
import { UpdateFriendDto } from './friend.dto';
import { getQuery } from '../../common/utils';

export const friendsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyFriends: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/friends/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend'],
    }),
    getReceivedFriends: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/friends/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend'],
    }),
    addFriend: build.mutation<void, UpdateFriendDto>({
      query: ({ userId }) => ({
        url: `/friends/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friend'],
    }),
    removeFriend: build.mutation<void, UpdateFriendDto>({
      query: ({ userId }) => ({
        url: `/friends/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Friend'],
    }),
  }),
});

export const {
  useGetMyFriendsQuery,
  useGetReceivedFriendsQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
} = friendsApi;
