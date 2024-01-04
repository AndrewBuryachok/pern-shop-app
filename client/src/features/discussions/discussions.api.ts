import { emptyApi } from '../../app/empty.api';
import {
  CreateDiscussionDto,
  DeleteDiscussionDto,
  EditDiscussionDto,
} from './discussion.dto';

export const discussionsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
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
  useCreateDiscussionMutation,
  useEditDiscussionMutation,
  useDeleteDiscussionMutation,
} = discussionsApi;
