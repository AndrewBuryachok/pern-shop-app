import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmUser, User } from '../users/user.model';
import { UpdateSubscriberDto } from './subscriber.dto';
import { getQuery } from '../../common/utils';

export const subscribersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMySubscribers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/subscribers/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend', 'Subscriber'],
    }),
    getReceivedSubscribers: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/subscribers/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'User', 'City', 'Friend', 'Subscriber'],
    }),
    selectMySubscribers: build.query<SmUser[], void>({
      query: () => ({
        url: '/subscribers/my/select',
      }),
      providesTags: ['Auth', 'User', 'Subscriber'],
    }),
    addSubscriber: build.mutation<void, UpdateSubscriberDto>({
      query: ({ userId }) => ({
        url: `/subscribers/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscriber'],
    }),
    removeSubscriber: build.mutation<void, UpdateSubscriberDto>({
      query: ({ userId }) => ({
        url: `/subscribers/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscriber'],
    }),
  }),
});

export const {
  useGetMySubscribersQuery,
  useGetReceivedSubscribersQuery,
  useSelectMySubscribersQuery,
  useAddSubscriberMutation,
  useRemoveSubscriberMutation,
} = subscribersApi;
