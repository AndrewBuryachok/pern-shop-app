import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Trade } from './trade.model';
import { CreateTradeDto, RateTradeDto } from './trade.dto';
import { waresApi } from '../wares/wares.api';
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
    createTrade: build.mutation<void, CreateTradeDto>({
      query: (dto) => ({
        url: '/trades',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Trade', 'Payment', 'Card'],
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = waresApi.util.selectInvalidatedBy(getState(), [
          'Ware',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainWares')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              waresApi.util.updateQueryData(
                'getMainWares',
                endpoint.originalArgs,
                (draft) => {
                  const ware = draft.result.find(
                    (ware) => ware.id === dto.wareId,
                  );
                  if (ware) {
                    ware.amount -= dto.amount;
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
      },
    }),
    rateTrade: build.mutation<void, RateTradeDto>({
      query: ({ tradeId, ...dto }) => ({
        url: `/trades/${tradeId}/rate`,
        method: 'PATCH',
        body: dto,
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
  useCreateTradeMutation,
  useRateTradeMutation,
} = tradesApi;
