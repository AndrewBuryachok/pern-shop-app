import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Product } from './product.model';
import { CreateProductDto } from './product.dto';
import { getQuery } from '../../common/utils';

export const productsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getProductsStats: build.query<IStats, void>({
      query: () => ({
        url: '/products/stats',
      }),
      providesTags: ['Product'],
    }),
    getMainProducts: build.query<IResponse<Product>, IRequest>({
      query: (req) => ({
        url: `/products?${getQuery(req)}`,
      }),
      providesTags: ['Product'],
    }),
    getMyProducts: build.query<IResponse<Product>, IRequest>({
      query: (req) => ({
        url: `/products/my?${getQuery(req)}`,
      }),
      providesTags: ['Product'],
    }),
    getAllProducts: build.query<IResponse<Product>, IRequest>({
      query: (req) => ({
        url: `/products/all?${getQuery(req)}`,
      }),
      providesTags: ['Product'],
    }),
    createProduct: build.mutation<void, CreateProductDto>({
      query: (dto) => ({
        url: '/products',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: [
        'Product',
        'Lease',
        'Cell',
        'Storage',
        'Payment',
        'Card',
      ],
    }),
  }),
});

export const {
  useGetProductsStatsQuery,
  useGetMainProductsQuery,
  useGetMyProductsQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
} = productsApi;
