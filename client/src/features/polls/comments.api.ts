import { emptyApi } from '../../app/empty.api';
import { PollComment } from './comment.model';
import {
  CreateCommentDto,
  DeleteCommentDto,
  EditCommentDto,
} from './comment.dto';

export const commentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    selectPollComments: build.query<PollComment[], number>({
      query: (pollId) => ({
        url: `/polls-comments/${pollId}`,
      }),
    }),
    createPollComment: build.mutation<void, CreateCommentDto>({
      query: (dto) => ({
        url: '/polls-comments',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['PollComment'],
    }),
    editPollComment: build.mutation<void, EditCommentDto>({
      query: ({ commentId, ...dto }) => ({
        url: `/polls-comments/${commentId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['PollComment'],
    }),
    deletePollComment: build.mutation<void, DeleteCommentDto>({
      query: ({ commentId }) => ({
        url: `/polls-comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PollComment'],
    }),
  }),
});

export const {
  useSelectPollCommentsQuery,
  useCreatePollCommentMutation,
  useEditPollCommentMutation,
  useDeletePollCommentMutation,
} = commentsApi;
