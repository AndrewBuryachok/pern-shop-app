import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Sale } from './sale.model';
import { CreateSaleDto } from './sale.dto';
import { getQuery } from '../../common/utils';

export const salesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMySales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/my?${getQuery(req)}`,
      }),
      providesTags: ['Sale'],
    }),
    getPlacedSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/placed?${getQuery(req)}`,
      }),
      providesTags: ['Sale'],
    }),
    getAllSales: build.query<IResponse<Sale>, IRequest>({
      query: (req) => ({
        url: `/sales/all?${getQuery(req)}`,
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
  }),
});

export const {
  useGetMySalesQuery,
  useGetPlacedSalesQuery,
  useGetAllSalesQuery,
  useCreateSaleMutation,
} = salesApi;
