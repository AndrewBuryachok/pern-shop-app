import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Sale, SmSale } from './sale.model';
import { CreateSaleDto, DeleteSaleDto, RateSaleDto } from './sale.dto';
import { getQuery } from '../../common/utils';

export const salesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMySales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    getSoldSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/sold?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    getPlacedSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    getAllSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    selectMySales: build.query<SmSale[], void>({
      query: () => ({
        url: '/sales/my/select',
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    selectUserSales: build.query<SmSale[], number>({
      query: (userId) => ({
        url: `/sales/${userId}/select`,
      }),
      providesTags: ['Sale'],
    }),
    createSale: build.mutation<void, CreateSaleDto>({
      query: (dto) => ({
        url: '/sales',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Sale', 'Product', 'Payment', 'Card'],
    }),
    rateSale: build.mutation<void, RateSaleDto>({
      query: ({ saleId, ...dto }) => ({
        url: `/sales/${saleId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Sale'],
    }),
    deleteSale: build.mutation<void, DeleteSaleDto>({
      query: ({ saleId }) => ({
        url: `/sales/${saleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sale'],
    }),
  }),
});

export const {
  useGetMySalesQuery,
  useGetSoldSalesQuery,
  useGetPlacedSalesQuery,
  useGetAllSalesQuery,
  useSelectMySalesQuery,
  useSelectUserSalesQuery,
  useCreateSaleMutation,
  useRateSaleMutation,
  useDeleteSaleMutation,
} = salesApi;
