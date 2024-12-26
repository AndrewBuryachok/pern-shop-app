import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Purchase, SmPurchaseWithPrice } from './purchase.model';
import {
  CreateMarketPurchaseDto,
  CreateShopPurchaseDto,
  CreateStoragePurchaseDto,
  PurchaseIdDto,
  RatePurchaseDto,
} from './purchase.dto';
import { getQuery } from '../../common/utils';

export const purchasesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyPurchases: build.query<IResponse<Purchase>, IRequest>({
      query: (req) => ({
        url: `/purchases/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Purchase'],
    }),
    getSoldPurchases: build.query<IResponse<Purchase>, IRequest>({
      query: (req) => ({
        url: `/purchases/sold?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Purchase'],
    }),
    getPlacedPurchases: build.query<IResponse<Purchase>, IRequest>({
      query: (req) => ({
        url: `/purchases/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Purchase'],
    }),
    getAllPurchases: build.query<IResponse<Purchase>, IRequest>({
      query: (req) => ({
        url: `/purchases/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Purchase'],
    }),
    selectMyPurchases: build.query<SmPurchaseWithPrice[], void>({
      query: () => ({
        url: '/purchases/my/select',
      }),
      providesTags: ['Auth', 'Purchase'],
    }),
    selectUserPurchases: build.query<SmPurchaseWithPrice[], number>({
      query: (userId) => ({
        url: `/purchases/${userId}/select`,
      }),
      providesTags: ['Purchase'],
    }),
    createShopPurchase: build.mutation<void, CreateShopPurchaseDto>({
      query: (dto) => ({
        url: '/purchases/shops',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Purchase', 'Good', 'Payment', 'Card'],
    }),
    createMarketPurchase: build.mutation<void, CreateMarketPurchaseDto>({
      query: (dto) => ({
        url: '/purchases/markets',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Purchase', 'Ware', 'Payment', 'Card'],
    }),
    createStoragePurchase: build.mutation<void, CreateStoragePurchaseDto>({
      query: (dto) => ({
        url: '/purchases/storages',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Purchase', 'Product', 'Payment', 'Card'],
    }),
    ratePurchase: build.mutation<void, RatePurchaseDto>({
      query: ({ purchaseId, ...dto }) => ({
        url: `/purchases/${purchaseId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Purchase'],
    }),
    deletePurchase: build.mutation<void, PurchaseIdDto>({
      query: ({ purchaseId }) => ({
        url: `/purchases/${purchaseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Purchase'],
    }),
  }),
});

export const {
  useGetMyPurchasesQuery,
  useGetSoldPurchasesQuery,
  useGetPlacedPurchasesQuery,
  useGetAllPurchasesQuery,
  useSelectMyPurchasesQuery,
  useSelectUserPurchasesQuery,
  useCreateShopPurchaseMutation,
  useCreateMarketPurchaseMutation,
  useCreateStoragePurchaseMutation,
  useRatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchasesApi;
