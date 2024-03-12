import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmUser, User } from '../users/user.model';
import { UpdateIgnorerDto } from './ignorer.dto';
import { getQuery } from '../../common/utils';

export const ignorersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyIgnorers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/ignorers/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'Ignorer'],
    }),
    getReceivedIgnorers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/ignorers/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'Ignorer'],
    }),
    selectMyIgnorers: build.query<SmUser[], void>({
      query: () => ({
        url: '/ignorers/my/select',
      }),
      providesTags: ['Auth', 'User', 'Ignorer'],
    }),
    addIgnorer: build.mutation<void, UpdateIgnorerDto>({
      query: ({ userId }) => ({
        url: `/ignorers/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Ignorer'],
    }),
    removeIgnorer: build.mutation<void, UpdateIgnorerDto>({
      query: ({ userId }) => ({
        url: `/ignorers/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ignorer'],
    }),
  }),
});

export const {
  useGetMyIgnorersQuery,
  useGetReceivedIgnorersQuery,
  useSelectMyIgnorersQuery,
  useAddIgnorerMutation,
  useRemoveIgnorerMutation,
} = ignorersApi;
