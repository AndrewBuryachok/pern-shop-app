import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { User } from '../users/user.model';
import { Town } from '../towns/town.model';
import { UserIdDto } from '../users/user.dto';
import { TownIdDto } from '../towns/town.dto';
import { getQuery } from '../../common/utils';

export const applicationsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getSentApplications: build.query<IResponse<Town>, IRequest>({
      query: (req) => ({
        url: `/applications/sent?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Application'],
    }),
    getReceivedApplications: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/applications/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Application'],
    }),
    createApplication: build.mutation<void, TownIdDto>({
      query: ({ townId }) => ({
        url: `/applications/sent/${townId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),
    cancelApplication: build.mutation<void, TownIdDto>({
      query: ({ townId }) => ({
        url: `/applications/sent/${townId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),
    acceptApplication: build.mutation<void, UserIdDto>({
      query: ({ userId }) => ({
        url: `/applications/received/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Application', 'Resident'],
    }),
    rejectApplication: build.mutation<void, UserIdDto>({
      query: ({ userId }) => ({
        url: `/applications/received/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useGetSentApplicationsQuery,
  useGetReceivedApplicationsQuery,
  useCreateApplicationMutation,
  useCancelApplicationMutation,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} = applicationsApi;
