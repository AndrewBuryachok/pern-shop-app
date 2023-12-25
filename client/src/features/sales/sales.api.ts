import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Sale } from './sale.model';
import { CreateSaleDto, RateSaleDto } from './sale.dto';
import { getQuery } from '../../common/utils';

export const salesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getSalesStats: build.query<number, void>({
      query: () => ({
        url: '/sales/stats',
      }),
      providesTags: ['Sale'],
    }),
    getMySales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Sale'],
    }),
    getSelledSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/selled?${getQuery(req)}`,
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
  }),
});

export const {
  useGetSalesStatsQuery,
  useGetMySalesQuery,
  useGetSelledSalesQuery,
  useGetPlacedSalesQuery,
  useGetAllSalesQuery,
  useCreateSaleMutation,
  useRateSaleMutation,
} = salesApi;
