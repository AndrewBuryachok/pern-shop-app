import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll } from './poll.model';
import {
  CompletePollDto,
  CreatePollDto,
  DeletePollDto,
  VotePollDto,
} from './poll.dto';
import { getQuery } from '../../common/utils';

export const pollsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls?${getQuery(req)}`,
      }),
      providesTags: ['Poll', 'Vote'],
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
      query: ({ pollId }) => ({
        url: `/polls/${pollId}`,
        method: 'POST',
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
    votePoll: build.mutation<void, VotePollDto>({
      query: ({ pollId, ...dto }) => ({
        url: `/polls/${pollId}/votes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Vote'],
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
  useVotePollMutation,
} = pollsApi;
