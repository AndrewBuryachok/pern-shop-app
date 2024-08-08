import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmTrade, Trade } from './trade.model';
import { CreateTradeDto, DeleteTradeDto, RateTradeDto } from './trade.dto';
import { getQuery } from '../../common/utils';

export const tradesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getTradesStats: build.query<number, void>({
      query: () => ({
        url: '/trades/stats',
      }),
      providesTags: ['Trade'],
    }),
    getMyTrades: build.query<IResponse<Trade>, IRequest>({
      query: (req) => ({
        url: `/trades/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Trade'],
    }),
    getSoldTrades: build.query<IResponse<Trade>, IRequest>({
      query: (req) => ({
        url: `/trades/sold?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Trade'],
    }),
    getPlacedTrades: build.query<IResponse<Trade>, IRequest>({
      query: (req) => ({
        url: `/trades/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Trade'],
    }),
    getAllTrades: build.query<IResponse<Trade>, IRequest>({
      query: (req) => ({
        url: `/trades/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Trade'],
    }),
    selectMyTrades: build.query<SmTrade[], void>({
      query: () => ({
        url: '/trades/my/select',
      }),
      providesTags: ['Auth', 'Trade'],
    }),
    selectUserTrades: build.query<SmTrade[], number>({
      query: (userId) => ({
        url: `/trades/${userId}/select`,
      }),
      providesTags: ['Trade'],
    }),
    createTrade: build.mutation<void, CreateTradeDto>({
      query: (dto) => ({
        url: '/trades',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Trade', 'Ware', 'Payment', 'Card'],
    }),
    rateTrade: build.mutation<void, RateTradeDto>({
      query: ({ tradeId, ...dto }) => ({
        url: `/trades/${tradeId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Trade'],
    }),
    deleteTrade: build.mutation<void, DeleteTradeDto>({
      query: ({ tradeId }) => ({
        url: `/trades/${tradeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trade'],
    }),
  }),
});

export const {
  useGetTradesStatsQuery,
  useGetMyTradesQuery,
  useGetSoldTradesQuery,
  useGetPlacedTradesQuery,
  useGetAllTradesQuery,
  useSelectMyTradesQuery,
  useSelectUserTradesQuery,
  useCreateTradeMutation,
  useRateTradeMutation,
  useDeleteTradeMutation,
} = tradesApi;
