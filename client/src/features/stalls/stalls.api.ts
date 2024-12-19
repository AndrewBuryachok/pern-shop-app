import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmStall, Stall } from './stall.model';
import { SmMarketTag } from '../markets-tags/market-tag.model';
import { CreateStallDto } from './stall.dto';
import { getQuery } from '../../common/utils';

export const stallsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainStalls: build.query<IResponse<Stall>, IRequest>({
      query: (req) => ({
        url: `/stalls?${getQuery(req)}`,
      }),
      providesTags: ['Stall'],
    }),
    getMyStalls: build.query<IResponse<Stall>, IRequest>({
      query: (req) => ({
        url: `/stalls/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Stall'],
    }),
    getAllStalls: build.query<IResponse<Stall>, IRequest>({
      query: (req) => ({
        url: `/stalls/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Stall'],
    }),
    selectMarketStalls: build.query<SmStall[], number>({
      query: (marketId) => ({
        url: `/stalls/${marketId}/markets`,
      }),
      providesTags: ['Stall'],
    }),
    selectTagStalls: build.query<SmStall[], number>({
      query: (marketTagId) => ({
        url: `/stalls/${marketTagId}/tags`,
      }),
      providesTags: ['Stall'],
    }),
    selectStallTag: build.query<SmMarketTag, number>({
      query: (stallId) => ({
        url: `/stalls/${stallId}/tag`,
      }),
      providesTags: ['MarketTag'],
    }),
    createStall: build.mutation<void, CreateStallDto>({
      query: (dto) => ({
        url: '/stalls',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Stall'],
    }),
  }),
});

export const {
  useGetMainStallsQuery,
  useGetMyStallsQuery,
  useGetAllStallsQuery,
  useSelectMarketStallsQuery,
  useSelectTagStallsQuery,
  useSelectStallTagQuery,
  useCreateStallMutation,
} = stallsApi;
