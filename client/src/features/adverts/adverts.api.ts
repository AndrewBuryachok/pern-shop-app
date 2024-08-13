import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Advert } from './advert.model';
import {
  CreateAdvertDto,
  DeleteAdvertDto,
  EditAdvertDto,
  RespondAdvertDto,
} from './advert.dto';
import { getQuery } from '../../common/utils';

export const advertsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainAdverts: build.query<IResponse<Advert>, IRequest>({
      query: (req) => ({
        url: `/adverts?${getQuery(req)}`,
      }),
      providesTags: ['Advert'],
    }),
    getMyAdverts: build.query<IResponse<Advert>, IRequest>({
      query: (req) => ({
        url: `/adverts/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Advert'],
    }),
    getAllAdverts: build.query<IResponse<Advert>, IRequest>({
      query: (req) => ({
        url: `/adverts/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Advert'],
    }),
    createAdvert: build.mutation<void, CreateAdvertDto>({
      query: (dto) => ({
        url: '/adverts',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Advert'],
    }),
    editAdvert: build.mutation<void, EditAdvertDto>({
      query: ({ advertId, ...dto }) => ({
        url: `/adverts/${advertId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Advert'],
    }),
    deleteAdvert: build.mutation<void, DeleteAdvertDto>({
      query: ({ advertId }) => ({
        url: `/adverts/${advertId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Advert'],
    }),
    respondAdvert: build.mutation<void, RespondAdvertDto>({
      query: ({ advertId, ...dto }) => ({
        url: `/adverts/${advertId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetMainAdvertsQuery,
  useGetMyAdvertsQuery,
  useGetAllAdvertsQuery,
  useCreateAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
  useRespondAdvertMutation,
} = advertsApi;
