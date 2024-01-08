import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Lot } from './lot.model';
import { State } from '../states/state.model';
import { CompleteLotDto, CreateLotDto } from './lot.dto';
import { getQuery } from '../../common/utils';

export const lotsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainLots: build.query<IResponse<Lot>, IRequest>({
      query: (req) => ({
        url: `/lots?${getQuery(req)}`,
      }),
      providesTags: ['Lot'],
    }),
    getMyLots: build.query<IResponse<Lot>, IRequest>({
      query: (req) => ({
        url: `/lots/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lot'],
    }),
    getPlacedLots: build.query<IResponse<Lot>, IRequest>({
      query: (req) => ({
        url: `/lots/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lot'],
    }),
    getAllLots: build.query<IResponse<Lot>, IRequest>({
      query: (req) => ({
        url: `/lots/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lot'],
    }),
    selectLotBids: build.query<State[], number>({
      query: (lotId) => ({
        url: `/lots/${lotId}/bids`,
      }),
      providesTags: ['Bid'],
    }),
    createLot: build.mutation<void, CreateLotDto>({
      query: (dto) => ({
        url: '/lots',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Lot', 'Lease', 'Cell', 'Payment', 'Card'],
    }),
    completeLot: build.mutation<void, CompleteLotDto>({
      query: ({ lotId }) => ({
        url: `/lots/${lotId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Lot', 'Payment', 'Card'],
    }),
  }),
});

export const {
  useGetMainLotsQuery,
  useGetMyLotsQuery,
  useGetPlacedLotsQuery,
  useGetAllLotsQuery,
  useSelectLotBidsQuery,
  useCreateLotMutation,
  useCompleteLotMutation,
} = lotsApi;
