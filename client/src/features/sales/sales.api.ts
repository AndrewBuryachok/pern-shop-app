import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Sale } from './sale.model';
import { CreateSaleDto } from './sale.dto';
import { getQuery } from '../../common/utils';

export const salesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getSalesStats: build.query<IStats, void>({
      query: () => ({
        url: '/sales/stats',
      }),
      providesTags: ['Active', 'Sale'],
    }),
    getMySales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/my?${getQuery(req)}`,
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
  }),
});

export const {
  useGetSalesStatsQuery,
  useGetMySalesQuery,
  useGetPlacedSalesQuery,
  useGetAllSalesQuery,
  useCreateSaleMutation,
} = salesApi;
