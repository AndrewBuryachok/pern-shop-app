import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Good } from './good.model';
import { State } from '../states/state.model';
import { MdPurchase } from '../purchases/purchase.model';
import {
  CreateGoodDto,
  EditGoodDto,
  GoodIdDto,
  UpdateGoodDto,
} from './good.dto';
import { getQuery } from '../../common/utils';

export const goodsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainGoods: build.query<IResponse<Good>, IRequest>({
      query: (req) => ({
        url: `/goods?${getQuery(req)}`,
      }),
      providesTags: ['Good', 'Purchase'],
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
    selectGoodPurchases: build.query<MdPurchase[], number>({
      query: (goodId) => ({
        url: `/goods/${goodId}/purchases`,
      }),
      providesTags: ['Purchase'],
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
    updateGood: build.mutation<void, UpdateGoodDto>({
      query: ({ goodId, ...dto }) => ({
        url: `/goods/${goodId}/states`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Good'],
    }),
    completeGood: build.mutation<void, GoodIdDto>({
      query: ({ goodId }) => ({
        url: `/goods/${goodId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Good'],
    }),
    deleteGood: build.mutation<void, GoodIdDto>({
      query: ({ goodId }) => ({
        url: `/goods/${goodId}`,
        method: 'DELETE',
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
  useSelectGoodPurchasesQuery,
  useCreateGoodMutation,
  useEditGoodMutation,
  useUpdateGoodMutation,
  useCompleteGoodMutation,
  useDeleteGoodMutation,
} = goodsApi;
