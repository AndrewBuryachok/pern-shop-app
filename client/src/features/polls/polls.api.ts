import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll } from './poll.model';
import { CompletePollDto, CreatePollDto, DeletePollDto } from './poll.dto';
import { getQuery } from '../../common/utils';

export const pollsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    getMyPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    getVotedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/voted?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    getAllPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    createPoll: build.mutation<void, CreatePollDto>({
      query: (dto) => ({
        url: '/polls',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Poll'],
    }),
    completePoll: build.mutation<void, CompletePollDto>({
      query: ({ pollId, ...dto }) => ({
        url: `/polls/${pollId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Poll'],
    }),
    deletePoll: build.mutation<void, DeletePollDto>({
      query: ({ pollId }) => ({
        url: `/polls/${pollId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Poll', 'Vote'],
    }),
  }),
});

export const {
  useGetMainPollsQuery,
  useGetMyPollsQuery,
  useGetVotedPollsQuery,
  useGetAllPollsQuery,
  useCreatePollMutation,
  useCompletePollMutation,
  useDeletePollMutation,
} = pollsApi;
