import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Vote } from './vote.model';
import { CreateVoteDto } from './vote.dto';
import { getQuery } from '../../common/utils';

export const votesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyVotes: build.query<IResponse<Vote>, IRequest>({
      query: (req) => ({
        url: `/votes/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Vote'],
    }),
    getPolledVotes: build.query<IResponse<Vote>, IRequest>({
      query: (req) => ({
        url: `/votes/polled?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Vote'],
    }),
    getAllVotes: build.query<IResponse<Vote>, IRequest>({
      query: (req) => ({
        url: `/votes/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Vote'],
    }),
    createVote: build.mutation<void, CreateVoteDto>({
      query: (dto) => ({
        url: '/votes',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Vote'],
    }),
  }),
});

export const {
  useGetMyVotesQuery,
  useGetPolledVotesQuery,
  useGetAllVotesQuery,
  useCreateVoteMutation,
} = votesApi;
