import { emptyApi } from '../../app/empty.api';
import { Discussion } from './discussion.model';
import {
  CreateDiscussionDto,
  DeleteDiscussionDto,
  EditDiscussionDto,
} from './discussion.dto';

export const discussionsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    selectPollDiscussions: build.query<Discussion[], number>({
      query: (pollId) => ({
        url: `/discussions/${pollId}`,
      }),
      providesTags: ['Discussion'],
    }),
    createDiscussion: build.mutation<void, CreateDiscussionDto>({
      query: (dto) => ({
        url: '/discussions',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Discussion'],
    }),
    editDiscussion: build.mutation<void, EditDiscussionDto>({
      query: ({ discussionId, ...dto }) => ({
        url: `/discussions/${discussionId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Discussion'],
    }),
    deleteDiscussion: build.mutation<void, DeleteDiscussionDto>({
      query: ({ discussionId }) => ({
        url: `/discussions/${discussionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discussion'],
    }),
  }),
});

export const {
  useSelectPollDiscussionsQuery,
  useCreateDiscussionMutation,
  useEditDiscussionMutation,
  useDeleteDiscussionMutation,
} = discussionsApi;
