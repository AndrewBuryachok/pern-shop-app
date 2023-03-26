import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Shop, SmShop, SmShopWithUser } from './shop.model';
import { CreateShopDto, EditShopDto } from './shop.dto';
import { getQuery } from '../../common/utils';

export const shopsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainShops: build.query<IResponse<Shop>, IRequest>({
      query: (req) => ({
        url: `/shops?${getQuery(req)}`,
      }),
      providesTags: ['Shop'],
    }),
    getMyShops: build.query<IResponse<Shop>, IRequest>({
      query: (req) => ({
        url: `/shops/my?${getQuery(req)}`,
      }),
      providesTags: ['Shop'],
    }),
    getAllShops: build.query<IResponse<Shop>, IRequest>({
      query: (req) => ({
        url: `/shops/all?${getQuery(req)}`,
      }),
      providesTags: ['Shop'],
    }),
    selectAllShops: build.query<SmShopWithUser[], void>({
      query: () => ({
        url: '/shops/all/select',
      }),
      providesTags: ['Shop'],
    }),
    selectMyShops: build.query<SmShop[], void>({
      query: () => ({
        url: '/shops/my/select',
      }),
      providesTags: ['Shop'],
    }),
    createShop: build.mutation<void, CreateShopDto>({
      query: (dto) => ({
        url: '/shops',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Shop'],
    }),
    editShop: build.mutation<void, EditShopDto>({
      query: ({ shopId, ...dto }) => ({
        url: `/shops/${shopId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Shop'],
    }),
  }),
});

export const {
  useGetMainShopsQuery,
  useGetMyShopsQuery,
  useGetAllShopsQuery,
  useSelectAllShopsQuery,
  useSelectMyShopsQuery,
  useCreateShopMutation,
  useEditShopMutation,
} = shopsApi;
