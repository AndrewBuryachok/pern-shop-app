import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll, SmPoll } from './poll.model';
import { PollView } from './poll-view.model';
import { Vote } from './vote.model';
import { Discussion } from '../discussions/discussion.model';
import {
  CompletePollDto,
  CreatePollDto,
  DeletePollDto,
  EditPollDto,
  ExtCreatePollDto,
  ExtVotePollDto,
  ViewPollDto,
} from './poll.dto';
import { getQuery } from '../../common/utils';

export const pollsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls?${getQuery(req)}`,
      }),
      providesTags: ['Poll'],
    }),
    getMyPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll'],
    }),
    getVotedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/voted?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Vote'],
    }),
    getDiscussedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/discussed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'Discussion'],
    }),
    getAllPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll'],
    }),
    selectViewedPolls: build.query<number[], void>({
      query: () => ({
        url: '/polls/viewed/select',
      }),
      providesTags: ['Auth', 'PollView'],
    }),
    selectVotedPolls: build.query<SmPoll[], void>({
      query: () => ({
        url: '/polls/voted/select',
      }),
      providesTags: ['Auth', 'Vote'],
    }),
    selectPollViews: build.query<PollView[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/views`,
      }),
      providesTags: ['PollView'],
    }),
    selectPollUpVotes: build.query<Vote[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/upVotes`,
      }),
      providesTags: ['Vote'],
    }),
    selectPollDownVotes: build.query<Vote[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/downVotes`,
      }),
      providesTags: ['Vote'],
    }),
    selectPollDiscussions: build.query<Discussion[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/discussions`,
      }),
      providesTags: ['Discussion'],
      async onQueryStarted(pollId, { dispatch, queryFulfilled, getState }) {
        const { data: discussions } = await queryFulfilled;
        const endpoints = pollsApi.util.selectInvalidatedBy(getState(), [
          'Poll',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainPolls')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              pollsApi.util.updateQueryData(
                'getMainPolls',
                endpoint.originalArgs,
                (draft) => {
                  const poll = draft.result.find((poll) => poll.id === pollId);
                  if (poll) {
                    if (discussions.length) {
                      poll.discussion = discussions[discussions.length - 1];
                    } else {
                      poll.discussion = undefined;
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
      },
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
    viewPoll: build.mutation<void, ViewPollDto>({
      query: ({ pollId }) => ({
        url: `/polls/${pollId}/views`,
        method: 'POST',
      }),
      invalidatesTags: ['PollView'],
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = pollsApi.util.selectInvalidatedBy(getState(), [
          'Poll',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainPolls')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              pollsApi.util.updateQueryData(
                'getMainPolls',
                endpoint.originalArgs,
                (draft) => {
                  const poll = draft.result.find(
                    (poll) => poll.id === dto.pollId,
                  );
                  if (poll) {
                    poll.views++;
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
        const patchResult = dispatch(
          pollsApi.util.updateQueryData(
            'selectViewedPolls',
            undefined,
            (draft) => {
              draft.push(dto.pollId);
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    votePoll: build.mutation<void, ExtVotePollDto>({
      query: ({ pollId, ...dto }) => ({
        url: `/polls/${pollId}/votes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Vote'],
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = pollsApi.util.selectInvalidatedBy(getState(), [
          'Poll',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainPolls')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              pollsApi.util.updateQueryData(
                'getMainPolls',
                endpoint.originalArgs,
                (draft) => {
                  const poll = draft.result.find(
                    (poll) => poll.id === dto.pollId,
                  );
                  if (poll) {
                    if (dto.upVoted || dto.downVoted) {
                      if (dto.upVoted === dto.type) {
                        if (dto.type) {
                          poll.upVotes--;
                        } else {
                          poll.downVotes--;
                        }
                      } else {
                        if (dto.type) {
                          poll.upVotes++;
                          poll.downVotes--;
                        } else {
                          poll.downVotes++;
                          poll.upVotes--;
                        }
                      }
                    } else {
                      if (dto.type) {
                        poll.upVotes++;
                      } else {
                        poll.downVotes++;
                      }
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
        const patchResult = dispatch(
          pollsApi.util.updateQueryData(
            'selectVotedPolls',
            undefined,
            (draft) => {
              if (dto.upVoted || dto.downVoted) {
                if (dto.upVoted === dto.type) {
                  draft = draft.filter((poll) => poll.id === dto.pollId);
                } else {
                  draft.find((poll) => poll.id === dto.pollId)!.vote.type =
                    dto.type;
                }
              } else {
                draft.push({
                  id: dto.pollId,
                  vote: { id: 0, type: dto.type },
                });
              }
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
  }),
});

export const {
  useGetMainPollsQuery,
  useGetMyPollsQuery,
  useGetVotedPollsQuery,
  useGetDiscussedPollsQuery,
  useGetAllPollsQuery,
  useSelectViewedPollsQuery,
  useSelectVotedPollsQuery,
  useSelectPollViewsQuery,
  useSelectPollUpVotesQuery,
  useSelectPollDownVotesQuery,
  useSelectPollDiscussionsQuery,
  useCreateMyPollMutation,
  useCreateUserPollMutation,
  useEditPollMutation,
  useCompletePollMutation,
  useDeletePollMutation,
  useViewPollMutation,
  useVotePollMutation,
} = pollsApi;
