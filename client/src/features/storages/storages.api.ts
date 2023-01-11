import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import {
  SelectStorage,
  SelectStorageWithPrice,
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
      providesTags: ['Storage'],
    }),
    getAllStorages: build.query<IResponse<Storage>, IRequest>({
      query: (req) => ({
        url: `/storages/all?${getQuery(req)}`,
      }),
      providesTags: ['Storage'],
    }),
    selectMyStorages: build.query<SelectStorage[], void>({
      query: () => ({
        url: '/storages/my/select',
      }),
      providesTags: ['Storage'],
    }),
    selectFreeStorages: build.query<SelectStorageWithPrice[], void>({
      query: () => ({
        url: '/storages/free/select',
      }),
      providesTags: ['Storage'],
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
  useSelectMyStoragesQuery,
  useSelectFreeStoragesQuery,
  useCreateStorageMutation,
  useEditStorageMutation,
} = storagesApi;
