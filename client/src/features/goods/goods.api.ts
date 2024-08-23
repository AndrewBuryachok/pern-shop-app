import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Good } from './good.model';
import { State } from '../states/state.model';
import { CompleteGoodDto, CreateGoodDto, EditGoodDto } from './good.dto';
import { getQuery } from '../../common/utils';

export const goodsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainGoods: build.query<IResponse<Good>, IRequest>({
      query: (req) => ({
        url: `/goods?${getQuery(req)}`,
      }),
      providesTags: ['Good'],
    }),
    getMyGoods: build.query<IResponse<Good>, IRequest>({
      query: (req) => ({
        url: `/goods/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Good'],
    }),
    getAllGoods: build.query<IResponse<Good>, IRequest>({
      query: (req) => ({
        url: `/goods/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Good'],
    }),
    selectGoodStates: build.query<State[], number>({
      query: (goodId) => ({
        url: `/goods/${goodId}/states`,
      }),
      providesTags: ['Good'],
    }),
    selectGoodRating: build.query<{ rate: number }, number>({
      query: (goodId) => ({
        url: `/goods/${goodId}/rating`,
      }),
      providesTags: ['Bargain'],
    }),
    createGood: build.mutation<void, CreateGoodDto>({
      query: (dto) => ({
        url: '/goods',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Good'],
    }),
    editGood: build.mutation<void, EditGoodDto>({
      query: ({ goodId, ...dto }) => ({
        url: `/goods/${goodId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Good'],
    }),
    completeGood: build.mutation<void, CompleteGoodDto>({
      query: ({ goodId }) => ({
        url: `/goods/${goodId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Good'],
    }),
  }),
});

export const {
  useGetMainGoodsQuery,
  useGetMyGoodsQuery,
  useGetAllGoodsQuery,
  useSelectGoodStatesQuery,
  useSelectGoodRatingQuery,
  useCreateGoodMutation,
  useEditGoodMutation,
  useCompleteGoodMutation,
} = goodsApi;
