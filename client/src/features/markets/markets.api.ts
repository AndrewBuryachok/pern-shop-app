import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Market, MyMarket, SmMarket } from './market.model';
import { State } from '../states/state.model';
import { CreateMarketDto, EditMarketDto } from './market.dto';
import { getQuery } from '../../common/utils';

export const marketsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainMarkets: build.query<IResponse<Market>, IRequest>({
      query: (req) => ({
        url: `/markets?${getQuery(req)}`,
      }),
      providesTags: ['Market'],
    }),
    getMyMarkets: build.query<IResponse<Market>, IRequest>({
      query: (req) => ({
        url: `/markets/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Market'],
    }),
    getAllMarkets: build.query<IResponse<Market>, IRequest>({
      query: (req) => ({
        url: `/markets/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Market'],
    }),
    selectMainMarkets: build.query<SmMarket[], void>({
      query: () => ({
        url: '/markets/main/select',
      }),
      providesTags: ['Market'],
    }),
    selectMyMarkets: build.query<MyMarket[], void>({
      query: () => ({
        url: '/markets/my/select',
      }),
      providesTags: ['Auth', 'Market', 'Store'],
    }),
    selectAllMarkets: build.query<MyMarket[], void>({
      query: () => ({
        url: '/markets/all/select',
      }),
      providesTags: ['Auth', 'Market', 'Store'],
    }),
    selectMarketStates: build.query<State[], number>({
      query: (marketId) => ({
        url: `/markets/${marketId}/states`,
      }),
      providesTags: ['Market'],
    }),
    createMarket: build.mutation<void, CreateMarketDto>({
      query: (dto) => ({
        url: '/markets',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Market'],
    }),
    editMarket: build.mutation<void, EditMarketDto>({
      query: ({ marketId, ...dto }) => ({
        url: `/markets/${marketId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Market'],
    }),
  }),
});

export const {
  useGetMainMarketsQuery,
  useGetMyMarketsQuery,
  useGetAllMarketsQuery,
  useSelectMainMarketsQuery,
  useSelectMyMarketsQuery,
  useSelectAllMarketsQuery,
  useSelectMarketStatesQuery,
  useCreateMarketMutation,
  useEditMarketMutation,
} = marketsApi;
