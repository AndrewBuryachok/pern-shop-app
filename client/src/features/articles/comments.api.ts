import { emptyApi } from '../../app/empty.api';
import { ArticleComment } from './comment.model';
import {
  CreateCommentDto,
  DeleteCommentDto,
  EditCommentDto,
} from './comment.dto';

export const commentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    selectArticleComments: build.query<ArticleComment[], number>({
      query: (articleId) => ({
        url: `/articles-comments/${articleId}`,
      }),
    }),
    createArticleComment: build.mutation<void, CreateCommentDto>({
      query: (dto) => ({
        url: '/articles-comments',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ArticleComment'],
    }),
    editArticleComment: build.mutation<void, EditCommentDto>({
      query: ({ commentId, ...dto }) => ({
        url: `/articles-comments/${commentId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ArticleComment'],
    }),
    deleteArticleComment: build.mutation<void, DeleteCommentDto>({
      query: ({ commentId }) => ({
        url: `/articles-comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ArticleComment'],
    }),
  }),
});

export const {
  useSelectArticleCommentsQuery,
  useCreateArticleCommentMutation,
  useEditArticleCommentMutation,
  useDeleteArticleCommentMutation,
} = commentsApi;
