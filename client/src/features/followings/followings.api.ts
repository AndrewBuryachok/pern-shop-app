import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { User } from '../users/user.model';
import { UpdateFollowingDto } from './following.dto';
import { getQuery } from '../../common/utils';

export const followingsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyFollowings: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/followings/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend', 'Following'],
    }),
    getReceivedFollowings: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/followings/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend', 'Following'],
    }),
    addFollowing: build.mutation<void, UpdateFollowingDto>({
      query: ({ userId }) => ({
        url: `/followings/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Following'],
    }),
    removeFollowing: build.mutation<void, UpdateFollowingDto>({
      query: ({ userId }) => ({
        url: `/followings/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Following'],
    }),
  }),
});

export const {
  useGetMyFollowingsQuery,
  useGetReceivedFollowingsQuery,
  useAddFollowingMutation,
  useRemoveFollowingMutation,
} = followingsApi;
