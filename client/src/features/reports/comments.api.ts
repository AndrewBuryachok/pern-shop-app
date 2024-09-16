import { emptyApi } from '../../app/empty.api';
import { ReportComment } from './comment.model';
import {
  CreateCommentDto,
  DeleteCommentDto,
  EditCommentDto,
} from './comment.dto';

export const commentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    selectReportComments: build.query<ReportComment[], number>({
      query: (reportId) => ({
        url: `/reports-comments/${reportId}`,
      }),
      providesTags: ['ReportComment'],
    }),
    createReportComment: build.mutation<void, CreateCommentDto>({
      query: (dto) => ({
        url: '/reports-comments',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ReportComment'],
    }),
    editReportComment: build.mutation<void, EditCommentDto>({
      query: ({ commentId, ...dto }) => ({
        url: `/reports-comments/${commentId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ReportComment'],
    }),
    deleteReportComment: build.mutation<void, DeleteCommentDto>({
      query: ({ commentId }) => ({
        url: `/reports-comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ReportComment'],
    }),
  }),
});

export const {
  useSelectReportCommentsQuery,
  useCreateReportCommentMutation,
  useEditReportCommentMutation,
  useDeleteReportCommentMutation,
} = commentsApi;
