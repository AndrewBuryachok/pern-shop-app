import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import {
  MyStorage,
  SmStorageWithCard,
  SmStorageWithPrice,
  Storage,
} from './storage.model';
import { CreateStorageDto, EditStorageDto } from './storage.dto';
import { getQuery } from '../../common/utils';

export const storagesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainStorages: build.query<IResponse<Storage>, IRequest>({
      query: (req) => ({
        url: `/storages?${getQuery(req)}`,
      }),
      providesTags: ['Storage'],
    }),
    getMyStorages: build.query<IResponse<Storage>, IRequest>({
      query: (req) => ({
        url: `/storages/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Storage'],
    }),
    getAllStorages: build.query<IResponse<Storage>, IRequest>({
      query: (req) => ({
        url: `/storages/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Storage'],
    }),
    selectMainStorages: build.query<SmStorageWithCard[], void>({
      query: () => ({
        url: '/storages/main/select',
      }),
      providesTags: ['Storage'],
    }),
    selectMyStorages: build.query<MyStorage[], void>({
      query: () => ({
        url: '/storages/my/select',
      }),
      providesTags: ['Auth', 'Storage', 'Cell'],
    }),
    selectAllStorages: build.query<MyStorage[], void>({
      query: () => ({
        url: '/storages/all/select',
      }),
      providesTags: ['Auth', 'Storage', 'Cell'],
    }),
    selectFreeStorages: build.query<SmStorageWithPrice[], void>({
      query: () => ({
        url: '/storages/free/select',
      }),
      providesTags: ['Storage', 'Cell'],
    }),
    createStorage: build.mutation<void, CreateStorageDto>({
      query: (dto) => ({
        url: '/storages',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Storage'],
    }),
    editStorage: build.mutation<void, EditStorageDto>({
      query: ({ storageId, ...dto }) => ({
        url: `/storages/${storageId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Storage'],
    }),
  }),
});

export const {
  useGetMainStoragesQuery,
  useGetMyStoragesQuery,
  useGetAllStoragesQuery,
  useSelectMainStoragesQuery,
  useSelectMyStoragesQuery,
  useSelectAllStoragesQuery,
  useSelectFreeStoragesQuery,
  useCreateStorageMutation,
  useEditStorageMutation,
} = storagesApi;
