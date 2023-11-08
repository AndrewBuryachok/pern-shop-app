import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmStore, Store } from './store.model';
import { CreateStoreDto } from './store.dto';
import { getQuery } from '../../common/utils';

export const storesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainStores: build.query<IResponse<Store>, IRequest>({
      query: (req) => ({
        url: `/stores?${getQuery(req)}`,
      }),
      providesTags: ['Store'],
    }),
    getMyStores: build.query<IResponse<Store>, IRequest>({
      query: (req) => ({
        url: `/stores/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Store'],
    }),
    getAllStores: build.query<IResponse<Store>, IRequest>({
      query: (req) => ({
        url: `/stores/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Store'],
    }),
    selectMarketStores: build.query<SmStore[], number>({
      query: (userId) => ({
        url: `/stores/${userId}/select`,
      }),
      providesTags: ['Store'],
    }),
    createStore: build.mutation<void, CreateStoreDto>({
      query: (dto) => ({
        url: '/stores',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetMainStoresQuery,
  useGetMyStoresQuery,
  useGetAllStoresQuery,
  useSelectMarketStoresQuery,
  useCreateStoreMutation,
} = storesApi;
