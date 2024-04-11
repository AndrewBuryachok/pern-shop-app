import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { MarketTag, SmMarketTag } from './market-tag.model';
import { State } from '../states/state.model';
import { CreateMarketTagDto, EditMarketTagDto } from './market-tag.dto';
import { getQuery } from '../../common/utils';

export const marketsTagsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainMarketsTags: build.query<IResponse<MarketTag>, IRequest>({
      query: (req) => ({
        url: `/markets-tags?${getQuery(req)}`,
      }),
      providesTags: ['MarketTag'],
    }),
    getMyMarketsTags: build.query<IResponse<MarketTag>, IRequest>({
      query: (req) => ({
        url: `/markets-tags/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketTag'],
    }),
    getAllMarketsTags: build.query<IResponse<MarketTag>, IRequest>({
      query: (req) => ({
        url: `/markets-tags/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketTag'],
    }),
    selectMarketTags: build.query<SmMarketTag[], number>({
      query: (marketId) => ({
        url: `/markets-tags/${marketId}/select`,
      }),
      providesTags: ['MarketTag'],
    }),
    selectMarketTagStates: build.query<State[], number>({
      query: (marketTagId) => ({
        url: `/markets-tags/${marketTagId}/states`,
      }),
      providesTags: ['MarketTag'],
    }),
    createMarketTag: build.mutation<void, CreateMarketTagDto>({
      query: (dto) => ({
        url: '/markets-tags',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['MarketTag'],
    }),
    editMarketTag: build.mutation<void, EditMarketTagDto>({
      query: ({ marketTagId, ...dto }) => ({
        url: `/markets-tags/${marketTagId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['MarketTag'],
    }),
  }),
});

export const {
  useGetMainMarketsTagsQuery,
  useGetMyMarketsTagsQuery,
  useGetAllMarketsTagsQuery,
  useSelectMarketTagsQuery,
  useSelectMarketTagStatesQuery,
  useCreateMarketTagMutation,
  useEditMarketTagMutation,
} = marketsTagsApi;
