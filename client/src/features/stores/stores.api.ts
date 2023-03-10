import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Store } from './store.model';
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
      providesTags: ['Store'],
    }),
    getAllStores: build.query<IResponse<Store>, IRequest>({
      query: (req) => ({
        url: `/stores/all?${getQuery(req)}`,
      }),
      providesTags: ['Store'],
    }),
    createStore: build.mutation<void, CreateStoreDto>({
      query: (dto) => ({
        url: '/stores',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Store', 'Market'],
    }),
  }),
});

export const {
  useGetMainStoresQuery,
  useGetMyStoresQuery,
  useGetAllStoresQuery,
  useCreateStoreMutation,
} = storesApi;
