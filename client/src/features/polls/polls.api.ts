import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll, SmPoll } from './poll.model';
import { PollView } from './poll-view.model';
import { PollLike } from './poll-like.model';
import {
  CompletePollDto,
  CreatePollDto,
  DeletePollDto,
  EditPollDto,
  ExtCreatePollDto,
  ExtLikePollDto,
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
    getLikedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/liked?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'PollLike'],
    }),
    getCommentedPolls: build.query<IResponse<Poll>, IRequest>({
      query: (req) => ({
        url: `/polls/commented?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Poll', 'PollComment'],
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
    selectLikedPolls: build.query<SmPoll[], void>({
      query: () => ({
        url: '/polls/liked/select',
      }),
      providesTags: ['Auth', 'PollLike'],
    }),
    selectPollViews: build.query<PollView[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/views`,
      }),
    }),
    selectPollLikes: build.query<PollLike[], number>({
      query: (pollId) => ({
        url: `/polls/${pollId}/likes`,
      }),
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
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
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
    likePoll: build.mutation<void, ExtLikePollDto>({
      query: ({ pollId, upLiked, downLiked, ...dto }) => ({
        url: `/polls/${pollId}/likes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['PollLike'],
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          pollsApi.util.updateQueryData(
            'selectLikedPolls',
            undefined,
            (draft) => {
              if (dto.upLiked || dto.downLiked) {
                if (dto.upLiked === dto.type) {
                  draft = draft.filter((poll) => poll.id === dto.pollId);
                } else {
                  draft.find((poll) => poll.id === dto.pollId)!.like.type =
                    dto.type;
                }
              } else {
                draft.push({
                  id: dto.pollId,
                  like: { id: 0, type: dto.type },
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
  useGetLikedPollsQuery,
  useGetCommentedPollsQuery,
  useGetAllPollsQuery,
  useSelectViewedPollsQuery,
  useSelectLikedPollsQuery,
  useSelectPollViewsQuery,
  useSelectPollLikesQuery,
  useCreateMyPollMutation,
  useCreateUserPollMutation,
  useEditPollMutation,
  useCompletePollMutation,
  useDeletePollMutation,
  useViewPollMutation,
  useLikePollMutation,
} = pollsApi;
