import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Poll } from './poll.model';
import { PollView } from './poll-view.model';
import { PollLike } from './poll-like.model';
import {
  CompletePollDto,
  CreatePollDto,
  DeletePollDto,
  EditPollDto,
  ExtCreatePollDto,
  LikePollDto,
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
      providesTags: ['Auth'],
    }),
    selectLikedPolls: build.query<{ up: number[]; down: number[] }, void>({
      query: () => ({
        url: '/polls/liked/select',
      }),
      providesTags: ['Auth'],
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
    likePoll: build.mutation<void, LikePollDto>({
      query: ({ pollId, ...dto }) => ({
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
              if (dto.type) {
                draft.down = draft.down.filter((id) => id !== dto.pollId);
                if (draft.up.includes(dto.pollId)) {
                  draft.up = draft.up.filter((id) => id !== dto.pollId);
                } else {
                  draft.up.push(dto.pollId);
                }
              } else {
                draft.up = draft.up.filter((id) => id !== dto.pollId);
                if (draft.down.includes(dto.pollId)) {
                  draft.down = draft.down.filter((id) => id !== dto.pollId);
                } else {
                  draft.down.push(dto.pollId);
                }
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
