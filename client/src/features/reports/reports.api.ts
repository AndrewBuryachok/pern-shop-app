import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Report, SmReport } from './report.model';
import { ReportView } from './report-view.model';
import { Attitude } from './attitude.model';
import { Annotation } from '../annotations/annotation.model';
import {
  CreateReportDto,
  DeleteReportDto,
  EditReportDto,
  ExtAttitudeReportDto,
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
    getStatusReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/status?${getQuery(req)}`,
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
    selectAttitudedReports: build.query<SmReport[], void>({
      query: () => ({
        url: '/reports/attituded/select',
      }),
      providesTags: ['Auth', 'Attitude'],
    }),
    selectReportViews: build.query<ReportView[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/views`,
      }),
      providesTags: ['ReportView'],
    }),
    selectReportUpAttitudes: build.query<Attitude[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/upAttitudes`,
      }),
      providesTags: ['Attitude'],
    }),
    selectReportDownAttitudes: build.query<Attitude[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/downAttitudes`,
      }),
      providesTags: ['Attitude'],
    }),
    selectReportAnnotations: build.query<Annotation[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/annotations`,
      }),
      providesTags: ['Annotation'],
      async onQueryStarted(reportId, { dispatch, queryFulfilled, getState }) {
        const { data: annotations } = await queryFulfilled;
        const endpoints = reportsApi.util.selectInvalidatedBy(getState(), [
          'Report',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainReports')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              reportsApi.util.updateQueryData(
                'getMainReports',
                endpoint.originalArgs,
                (draft) => {
                  const report = draft.result.find(
                    (report) => report.id === reportId,
                  );
                  if (report) {
                    if (annotations.length) {
                      report.annotation = annotations[annotations.length - 1];
                    } else {
                      report.annotation = undefined;
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
      },
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
    createStatusReport: build.mutation<void, CreateReportDto>({
      query: (dto) => ({
        url: '/reports/status',
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
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = reportsApi.util.selectInvalidatedBy(getState(), [
          'Report',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainReports')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              reportsApi.util.updateQueryData(
                'getMainReports',
                endpoint.originalArgs,
                (draft) => {
                  const report = draft.result.find(
                    (report) => report.id === dto.reportId,
                  );
                  if (report) {
                    report.views++;
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
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
    attitudeReport: build.mutation<void, ExtAttitudeReportDto>({
      query: ({ reportId, upAttituded, downAttituded, ...dto }) => ({
        url: `/reports/${reportId}/attitudes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Attitude'],
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = reportsApi.util.selectInvalidatedBy(getState(), [
          'Report',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainReports')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              reportsApi.util.updateQueryData(
                'getMainReports',
                endpoint.originalArgs,
                (draft) => {
                  const report = draft.result.find(
                    (report) => report.id === dto.reportId,
                  );
                  if (report) {
                    if (dto.upAttituded || dto.downAttituded) {
                      if (dto.upAttituded === dto.type) {
                        if (dto.type) {
                          report.upAttitudes--;
                        } else {
                          report.downAttitudes--;
                        }
                      } else {
                        if (dto.type) {
                          report.upAttitudes++;
                          report.downAttitudes--;
                        } else {
                          report.downAttitudes++;
                          report.upAttitudes--;
                        }
                      }
                    } else {
                      if (dto.type) {
                        report.upAttitudes++;
                      } else {
                        report.downAttitudes++;
                      }
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
        const patchResult = dispatch(
          reportsApi.util.updateQueryData(
            'selectAttitudedReports',
            undefined,
            (draft) => {
              if (dto.upAttituded || dto.downAttituded) {
                if (dto.upAttituded === dto.type) {
                  draft = draft.filter((report) => report.id === dto.reportId);
                } else {
                  draft.find(
                    (report) => report.id === dto.reportId,
                  )!.attitude.type = dto.type;
                }
              } else {
                draft.push({
                  id: dto.reportId,
                  attitude: { id: 0, type: dto.type },
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
  useGetStatusReportsQuery,
  useGetSpawnReportsQuery,
  useGetHubReportsQuery,
  useGetEndReportsQuery,
  useSelectViewedReportsQuery,
  useSelectAttitudedReportsQuery,
  useSelectReportViewsQuery,
  useSelectReportUpAttitudesQuery,
  useSelectReportDownAttitudesQuery,
  useSelectReportAnnotationsQuery,
  useCreateServerReportMutation,
  useCreateSiteReportMutation,
  useCreateStatusReportMutation,
  useCreateSpawnReportMutation,
  useCreateHubReportMutation,
  useCreateEndReportMutation,
  useEditReportMutation,
  useDeleteReportMutation,
  useViewReportMutation,
  useAttitudeReportMutation,
} = reportsApi;
