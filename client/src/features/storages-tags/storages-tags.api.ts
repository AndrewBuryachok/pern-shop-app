import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { MdStorageTag, SmStorageTag, StorageTag } from './storage-tag.model';
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
    selectFreeTags: build.query<MdStorageTag[], void>({
      query: () => ({
        url: '/storages-tags/free/select',
      }),
      providesTags: ['StorageTag', 'Cell'],
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
  useSelectFreeTagsQuery,
  useSelectStorageTagsQuery,
  useSelectStorageTagStatesQuery,
  useCreateStorageTagMutation,
  useEditStorageTagMutation,
} = storagesTagsApi;
