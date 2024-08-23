import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Bargain, SmBargain } from './bargain.model';
import {
  CreateBargainDto,
  DeleteBargainDto,
  RateBargainDto,
} from './bargain.dto';
import { getQuery } from '../../common/utils';

export const bargainsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyBargains: build.query<IResponse<Bargain>, IRequest>({
      query: (req) => ({
        url: `/bargains/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bargain'],
    }),
    getSoldBargains: build.query<IResponse<Bargain>, IRequest>({
      query: (req) => ({
        url: `/bargains/sold?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bargain'],
    }),
    getAllBargains: build.query<IResponse<Bargain>, IRequest>({
      query: (req) => ({
        url: `/bargains/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bargain'],
    }),
    selectMyBargains: build.query<SmBargain[], void>({
      query: () => ({
        url: '/bargains/my/select',
      }),
      providesTags: ['Auth', 'Bargain'],
    }),
    selectUserBargains: build.query<SmBargain[], number>({
      query: (userId) => ({
        url: `/bargains/${userId}/select`,
      }),
      providesTags: ['Bargain'],
    }),
    createBargain: build.mutation<void, CreateBargainDto>({
      query: (dto) => ({
        url: '/bargains',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Bargain', 'Good', 'Payment', 'Card'],
    }),
    rateBargain: build.mutation<void, RateBargainDto>({
      query: ({ bargainId, ...dto }) => ({
        url: `/bargains/${bargainId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Bargain'],
    }),
    deleteBargain: build.mutation<void, DeleteBargainDto>({
      query: ({ bargainId }) => ({
        url: `/bargains/${bargainId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bargain'],
    }),
  }),
});

export const {
  useGetMyBargainsQuery,
  useGetSoldBargainsQuery,
  useGetAllBargainsQuery,
  useSelectMyBargainsQuery,
  useSelectUserBargainsQuery,
  useCreateBargainMutation,
  useRateBargainMutation,
  useDeleteBargainMutation,
} = bargainsApi;
