import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Report, SmReport } from './report.model';
import { Attitude } from './attitude.model';
import { Annotation } from '../annotations/annotation.model';
import {
  CreateReportDto,
  DeleteReportDto,
  EditReportDto,
  AttitudeReportDto,
} from './report.dto';
import { getQuery } from '../../common/utils';

export const reportsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    getServerReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/server?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    getSiteReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/site?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    getStatusReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/status?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    getSpawnReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/spawn?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    getHubReports: build.query<IResponse<Report>, IRequest>({
      query: (req) => ({
        url: `/reports/hub?${getQuery(req)}`,
      }),
      providesTags: ['Report', 'Attitude', 'Annotation'],
    }),
    selectAttitudedReports: build.query<SmReport[], void>({
      query: () => ({
        url: '/reports/attituded/select',
      }),
      providesTags: ['Auth', 'Report', 'Attitude'],
    }),
    selectReportAttitudes: build.query<Attitude[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/attitudes`,
      }),
      providesTags: ['Attitude'],
    }),
    selectReportAnnotations: build.query<Annotation[], number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/annotations`,
      }),
      providesTags: ['Annotation'],
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
    attitudeReport: build.mutation<void, AttitudeReportDto>({
      query: ({ reportId, ...dto }) => ({
        url: `/reports/${reportId}/attitudes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Attitude'],
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
  useSelectAttitudedReportsQuery,
  useSelectReportAttitudesQuery,
  useSelectReportAnnotationsQuery,
  useCreateServerReportMutation,
  useCreateSiteReportMutation,
  useCreateStatusReportMutation,
  useCreateSpawnReportMutation,
  useCreateHubReportMutation,
  useEditReportMutation,
  useDeleteReportMutation,
  useAttitudeReportMutation,
} = reportsApi;
