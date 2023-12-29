import { emptyApi } from '../../app/empty.api';
import {
  CreateCommentDto,
  DeleteCommentDto,
  EditCommentDto,
} from './comment.dto';

export const commentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createComment: build.mutation<void, CreateCommentDto>({
      query: (dto) => ({
        url: '/comments',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Comment'],
    }),
    editComment: build.mutation<void, EditCommentDto>({
      query: ({ commentId, ...dto }) => ({
        url: `/comments/${commentId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: build.mutation<void, DeleteCommentDto>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
