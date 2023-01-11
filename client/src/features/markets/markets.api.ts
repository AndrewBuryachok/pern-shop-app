import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Market, SelectMarket } from './market.model';
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
      providesTags: ['Market'],
    }),
    getAllMarkets: build.query<IResponse<Market>, IRequest>({
      query: (req) => ({
        url: `/markets/all?${getQuery(req)}`,
      }),
      providesTags: ['Market'],
    }),
    selectMyMarkets: build.query<SelectMarket[], void>({
      query: () => ({
        url: '/markets/my/select',
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
  useSelectMyMarketsQuery,
  useCreateMarketMutation,
  useEditMarketMutation,
} = marketsApi;
