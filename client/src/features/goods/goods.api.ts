import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Good } from './good.model';
import { CreateGoodDto, DeleteGoodDto, EditGoodDto } from './good.dto';
import { getQuery } from '../../common/utils';

export const goodsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getGoodsStats: build.query<IStats, void>({
      query: () => ({
        url: '/goods/stats',
      }),
      providesTags: ['Good'],
    }),
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
    deleteGood: build.mutation<void, DeleteGoodDto>({
      query: ({ goodId }) => ({
        url: `/goods/${goodId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Good'],
    }),
  }),
});

export const {
  useGetGoodsStatsQuery,
  useGetMainGoodsQuery,
  useGetMyGoodsQuery,
  useGetAllGoodsQuery,
  useCreateGoodMutation,
  useEditGoodMutation,
  useDeleteGoodMutation,
} = goodsApi;
