import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Trade } from './trade.model';
import { CreateTradeDto } from './trade.dto';
import { getQuery } from '../../common/utils';

export const tradesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getTradesStats: build.query<IStats, void>({
      query: () => ({
        url: '/trades/stats',
      }),
      providesTags: ['Active', 'Trade'],
    }),
    getMyTrades: build.query<IResponse<Trade>, IRequest>({
      query: (req) => ({
        url: `/trades/my?${getQuery(req)}`,
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
    createTrade: build.mutation<void, CreateTradeDto>({
      query: (dto) => ({
        url: '/trades',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Trade', 'Ware', 'Payment', 'Card'],
    }),
  }),
});

export const {
  useGetTradesStatsQuery,
  useGetMyTradesQuery,
  useGetPlacedTradesQuery,
  useGetAllTradesQuery,
  useCreateTradeMutation,
} = tradesApi;
