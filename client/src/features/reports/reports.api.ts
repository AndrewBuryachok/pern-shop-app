import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Report, SmReport } from './report.model';
import { ReportView } from './report-view.model';
import { ReportLike } from './report-like.model';
import {
  CreateReportDto,
  DeleteReportDto,
  EditReportDto,
  ExtLikeReportDto,
  ViewReportDto,
} from './report.dto';
import { getQuery } from '../../common/utils';

export const reportsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getServerReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/server?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getSiteReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/site?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getEventsReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/events?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getSpawnReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/spawn?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getHubReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/hub?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    getEndReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/end?${getQuery(req)}`,
      }),
      providesTags: ['Report'],
    }),
    selectViewedReports: build.query<number[], void>({
      query: () => ({
        url: '/reports/viewed/select',
      }),
      providesTags: ['Auth', 'ReportView'],
    }),
    selectLikedReports: build.query<SmReport[], void>({
      query: () => ({
        url: '/reports/liked/select',
      }),
      providesTags: ['Auth', 'ReportLike'],
    }),
    selectReportViews: build.query<ReportView[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/views`,
      }),
    }),
    selectReportLikes: build.query<ReportLike[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/likes`,
      }),
    }),
    createServerReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/server',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    createSiteReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/site',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    createEventsReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/events',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    createSpawnReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/spawn',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    createHubReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/hub',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    createEndReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/end',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    editReport: build.mutation<void, EditReportDto>({
      query: ({ reportId, ...dto }) => ({
        url: `/reports/${reportId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Report'],
    }),
    deleteReport: build.mutation<void, DeleteReportDto>({
      query: ({ reportId }) => ({
        url: `/reports/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),
    viewReport: build.mutation<void, ViewReportDto>({
      query: ({ reportId }) => ({
        url: `/reports/${reportId}/views`,
        method: 'POST',
      }),
      invalidatesTags: ['ReportView'],
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reportsApi.util.updateQueryData(
            'selectViewedReports',
            undefined,
            (draft) => {
              draft.push(dto.reportId);
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    likeReport: build.mutation<void, ExtLikeReportDto>({
      query: ({ reportId, upLiked, downLiked, ...dto }) => ({
        url: `/reports/${reportId}/likes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ReportLike'],
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reportsApi.util.updateQueryData(
            'selectLikedReports',
            undefined,
            (draft) => {
              if (dto.upLiked || dto.downLiked) {
                if (dto.upLiked === dto.type) {
                  draft = draft.filter((report) => report.id === dto.reportId);
                } else {
                  draft.find(
                    (report) => report.id === dto.reportId,
                  )!.like.type = dto.type;
                }
              } else {
                draft.push({
                  id: dto.reportId,
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
  useGetMainReportsQuery,
  useGetServerReportsQuery,
  useGetSiteReportsQuery,
  useGetEventsReportsQuery,
  useGetSpawnReportsQuery,
  useGetHubReportsQuery,
  useGetEndReportsQuery,
  useSelectViewedReportsQuery,
  useSelectLikedReportsQuery,
  useSelectReportViewsQuery,
  useSelectReportLikesQuery,
  useCreateServerReportMutation,
  useCreateSiteReportMutation,
  useCreateEventsReportMutation,
  useCreateSpawnReportMutation,
  useCreateHubReportMutation,
  useCreateEndReportMutation,
  useEditReportMutation,
  useDeleteReportMutation,
  useViewReportMutation,
  useLikeReportMutation,
} = reportsApi;
