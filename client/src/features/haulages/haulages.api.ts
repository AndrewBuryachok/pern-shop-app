import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import {
  CreateHaulageDto,
  EditHaulageDto,
  HaulageIdDto,
  RateHaulageDto,
  TakeHaulageDto,
} from './haulage.dto';
import { getQuery } from '../../common/utils';

export const haulagesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainHaulages: build.query<IResponse<Haulage>, IRequest>({
      query: (req) => ({
        url: `/haulages?${getQuery(req)}`,
      }),
      providesTags: ['Haulage'],
    }),
    getMyHaulages: build.query<IResponse<Haulage>, IRequest>({
      query: (req) => ({
        url: `/haulages/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Haulage'],
    }),
    getTakenHaulages: build.query<IResponse<Haulage>, IRequest>({
      query: (req) => ({
        url: `/haulages/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Haulage'],
    }),
    getPlacedHaulages: build.query<IResponse<Haulage>, IRequest>({
      query: (req) => ({
        url: `/haulages/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Haulage'],
    }),
    getAllHaulages: build.query<IResponse<Haulage>, IRequest>({
      query: (req) => ({
        url: `/haulages/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Haulage'],
    }),
    createHaulage: build.mutation<void, CreateHaulageDto>({
      query: (dto) => ({
        url: '/haulages',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Haulage', 'Hire', 'Box', 'Payment', 'Card'],
    }),
    editHaulage: build.mutation<void, EditHaulageDto>({
      query: ({ haulageId, ...dto }) => ({
        url: `/haulages/${haulageId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Haulage', 'Card'],
    }),
    takeHaulage: build.mutation<void, TakeHaulageDto>({
      query: ({ haulageId, ...dto }) => ({
        url: `/haulages/${haulageId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Haulage'],
    }),
    untakeHaulage: build.mutation<void, HaulageIdDto>({
      query: ({ haulageId }) => ({
        url: `/haulages/${haulageId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Haulage'],
    }),
    executeHaulage: build.mutation<void, HaulageIdDto>({
      query: ({ haulageId }) => ({
        url: `/haulages/${haulageId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['Haulage'],
    }),
    completeHaulage: build.mutation<void, HaulageIdDto>({
      query: ({ haulageId }) => ({
        url: `/haulages/${haulageId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Haulage', 'Payment', 'Card'],
    }),
    deleteHaulage: build.mutation<void, HaulageIdDto>({
      query: ({ haulageId }) => ({
        url: `/haulages/${haulageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Haulage', 'Card'],
    }),
    rateHaulage: build.mutation<void, RateHaulageDto>({
      query: ({ haulageId, ...dto }) => ({
        url: `/haulages/${haulageId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Haulage'],
    }),
  }),
});

export const {
  useGetMainHaulagesQuery,
  useGetMyHaulagesQuery,
  useGetTakenHaulagesQuery,
  useGetPlacedHaulagesQuery,
  useGetAllHaulagesQuery,
  useCreateHaulageMutation,
  useEditHaulageMutation,
  useTakeHaulageMutation,
  useUntakeHaulageMutation,
  useExecuteHaulageMutation,
  useCompleteHaulageMutation,
  useDeleteHaulageMutation,
  useRateHaulageMutation,
} = haulagesApi;
