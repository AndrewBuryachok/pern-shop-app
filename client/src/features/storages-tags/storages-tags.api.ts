import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmStorageTag, StorageTag } from './storage-tag.model';
import { State } from '../states/state.model';
import { CreateStorageTagDto, EditStorageTagDto } from './storage-tag.dto';
import { getQuery } from '../../common/utils';

export const storagesTagsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainStoragesTags: build.query<IResponse<StorageTag>, IRequest>({
      query: (req) => ({
        url: `/storages-tags?${getQuery(req)}`,
      }),
      providesTags: ['StorageTag'],
    }),
    getMyStoragesTags: build.query<IResponse<StorageTag>, IRequest>({
      query: (req) => ({
        url: `/storages-tags/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageTag'],
    }),
    getAllStoragesTags: build.query<IResponse<StorageTag>, IRequest>({
      query: (req) => ({
        url: `/storages-tags/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageTag'],
    }),
    selectStorageTags: build.query<SmStorageTag[], number>({
      query: (storageId) => ({
        url: `/storages-tags/${storageId}/select`,
      }),
      providesTags: ['StorageTag'],
    }),
    selectStorageTagStates: build.query<State[], number>({
      query: (storageTagId) => ({
        url: `/storages-tags/${storageTagId}/states`,
      }),
      providesTags: ['StorageTag'],
    }),
    createStorageTag: build.mutation<void, CreateStorageTagDto>({
      query: (dto) => ({
        url: '/storages-tags',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['StorageTag'],
    }),
    editStorageTag: build.mutation<void, EditStorageTagDto>({
      query: ({ storageTagId, ...dto }) => ({
        url: `/storages-tags/${storageTagId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['StorageTag'],
    }),
  }),
});

export const {
  useGetMainStoragesTagsQuery,
  useGetMyStoragesTagsQuery,
  useGetAllStoragesTagsQuery,
  useSelectStorageTagsQuery,
  useSelectStorageTagStatesQuery,
  useCreateStorageTagMutation,
  useEditStorageTagMutation,
} = storagesTagsApi;
