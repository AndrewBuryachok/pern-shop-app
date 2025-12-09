import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Purchase, SmPurchaseWithPrice } from './purchase.model';
import { CreatePurchaseDto, PurchaseIdDto } from './purchase.dto';
import { getQuery } from '../../common/utils';

export const purchasesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyPurchases: build.query<IResponse<Purchase>, IRequest>({
      query: (req) => ({
        url: `/purchases/my?${getQuery(req)}`,
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
    createPurchase: build.mutation<void, CreatePurchaseDto>({
      query: (dto) => ({
        url: '/purchases',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Purchase', 'Good', 'Payment', 'Card'],
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
  useGetAllPurchasesQuery,
  useSelectMyPurchasesQuery,
  useSelectUserPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchasesApi;
