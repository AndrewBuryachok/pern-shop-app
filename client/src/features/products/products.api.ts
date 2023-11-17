import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Product } from './product.model';
import {
  CompleteProductDto,
  CreateProductDto,
  EditProductDto,
} from './product.dto';
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
      providesTags: ['Auth', 'Product'],
    }),
    getPlacedProducts: build.query<IResponse<Product>, IRequest>({
      query: (req) => ({
        url: `/products/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Product'],
    }),
    getAllProducts: build.query<IResponse<Product>, IRequest>({
      query: (req) => ({
        url: `/products/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Product'],
    }),
    createProduct: build.mutation<void, CreateProductDto>({
      query: (dto) => ({
        url: '/products',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Product', 'Lease', 'Cell', 'Payment', 'Card'],
    }),
    editProduct: build.mutation<void, EditProductDto>({
      query: ({ productId, ...dto }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Product'],
    }),
    completeProduct: build.mutation<void, CompleteProductDto>({
      query: ({ productId }) => ({
        url: `/products/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsStatsQuery,
  useGetMainProductsQuery,
  useGetMyProductsQuery,
  useGetPlacedProductsQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useCompleteProductMutation,
} = productsApi;
