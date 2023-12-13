import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import {
  CreatePlaintDto,
  DeletePlaintDto,
  UpdatePlaintDto,
} from './plaint.dto';
import { getQuery } from '../../common/utils';

export const plaintsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints?${getQuery(req)}`,
      }),
      providesTags: ['Plaint'],
    }),
    getMyPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint'],
    }),
    getReceivedPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint'],
    }),
    getAllPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint'],
    }),
    createPlaint: build.mutation<void, CreatePlaintDto>({
      query: (dto) => ({
        url: '/plaints',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    executePlaint: build.mutation<void, UpdatePlaintDto>({
      query: ({ plaintId, ...dto }) => ({
        url: `/plaints/${plaintId}/execute`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    completePlaint: build.mutation<void, UpdatePlaintDto>({
      query: ({ plaintId, ...dto }) => ({
        url: `/plaints/${plaintId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    deletePlaint: build.mutation<void, DeletePlaintDto>({
      query: ({ plaintId }) => ({
        url: `/plaints/${plaintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plaint'],
    }),
  }),
});

export const {
  useGetMainPlaintsQuery,
  useGetMyPlaintsQuery,
  useGetReceivedPlaintsQuery,
  useGetAllPlaintsQuery,
  useCreatePlaintMutation,
  useExecutePlaintMutation,
  useCompletePlaintMutation,
  useDeletePlaintMutation,
} = plaintsApi;
