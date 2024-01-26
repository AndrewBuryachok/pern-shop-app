import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll, SmPoll } from './poll.model';
import { Vote } from './vote.model';
import { Discussion } from '../discussions/discussion.model';
import {
  CompletePollDto,
  CreatePollDto,
  DeletePollDto,
  EditPollDto,
  ExtCreatePollDto,
  VotePollDto,
} from './poll.dto';
import { getQuery } from '../../common/utils';

export const pollsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls?${getQuery(req)}`,
      }),
      providesTags: ['Poll', 'Vote', 'Discussion'],
    }),
    getMyPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote', 'Discussion'],
    }),
    getVotedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/voted?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote', 'Discussion'],
    }),
    getDiscussedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/discussed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote', 'Discussion'],
    }),
    getAllPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote', 'Discussion'],
    }),
    selectVotedPolls: build.query<SmPoll[], void>({
      query: () => ({
        url: '/polls/voted/select',
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    selectPollVotes: build.query<Vote[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/votes`,
      }),
      providesTags: ['Vote'],
    }),
    selectPollDiscussions: build.query<Discussion[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/discussions`,
      }),
      providesTags: ['Discussion'],
    }),
    createMyPoll: build.mutation<void, CreatePollDto>({
      query: (dto) => ({
        url: '/polls',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Poll'],
    }),
    createUserPoll: build.mutation<void, ExtCreatePollDto>({
      query: (dto) => ({
        url: '/polls/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Poll'],
    }),
    editPoll: build.mutation<void, EditPollDto>({
      query: ({ pollId, ...dto }) => ({
        url: `/polls/${pollId}`,
        method: 'PATCH',
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
      invalidatesTags: ['Poll'],
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
  useGetDiscussedPollsQuery,
  useGetAllPollsQuery,
  useSelectVotedPollsQuery,
  useSelectPollVotesQuery,
  useSelectPollDiscussionsQuery,
  useCreateMyPollMutation,
  useCreateUserPollMutation,
  useEditPollMutation,
  useCompletePollMutation,
  useDeletePollMutation,
  useVotePollMutation,
} = pollsApi;
