import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import {
  CreateStorageDeliveryDto,
  StorageDeliveryIdDto,
  RateStorageDeliveryDto,
  TakeStorageDeliveryDto,
  EditStorageDeliveryDto,
} from './storage-delivery.dto';
import { getQuery } from '../../common/utils';

export const storagesDeliveriesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainSDeliveries: build.query<IResponse<StorageDelivery>, IRequest>({
      query: (req) => ({
        url: `/storages-deliveries?${getQuery(req)}`,
      }),
      providesTags: ['StorageDelivery'],
    }),
    getMySDeliveries: build.query<IResponse<StorageDelivery>, IRequest>({
      query: (req) => ({
        url: `/storages-deliveries/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageDelivery'],
    }),
    getTakenSDeliveries: build.query<IResponse<StorageDelivery>, IRequest>({
      query: (req) => ({
        url: `/storages-deliveries/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageDelivery'],
    }),
    getPlacedSDeliveries: build.query<IResponse<StorageDelivery>, IRequest>({
      query: (req) => ({
        url: `/storages-deliveries/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageDelivery'],
    }),
    getAllSDeliveries: build.query<IResponse<StorageDelivery>, IRequest>({
      query: (req) => ({
        url: `/storages-deliveries/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'StorageDelivery'],
    }),
    createStorageDelivery: build.mutation<void, CreateStorageDeliveryDto>({
      query: (dto) => ({
        url: '/storages-deliveries',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['StorageDelivery', 'Hire', 'Drawer', 'Payment', 'Card'],
    }),
    editStorageDelivery: build.mutation<void, EditStorageDeliveryDto>({
      query: ({ storageDeliveryId, ...dto }) => ({
        url: `/storages-deliveries/${storageDeliveryId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['StorageDelivery', 'Card'],
    }),
    takeStorageDelivery: build.mutation<void, TakeStorageDeliveryDto>({
      query: ({ storageDeliveryId, ...dto }) => ({
        url: `/storages-deliveries/${storageDeliveryId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['StorageDelivery'],
    }),
    untakeStorageDelivery: build.mutation<void, StorageDeliveryIdDto>({
      query: ({ storageDeliveryId }) => ({
        url: `/storages-deliveries/${storageDeliveryId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StorageDelivery'],
    }),
    executeStorageDelivery: build.mutation<void, StorageDeliveryIdDto>({
      query: ({ storageDeliveryId }) => ({
        url: `/storages-deliveries/${storageDeliveryId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['StorageDelivery'],
    }),
    completeStorageDelivery: build.mutation<void, StorageDeliveryIdDto>({
      query: ({ storageDeliveryId }) => ({
        url: `/storages-deliveries/${storageDeliveryId}`,
        method: 'POST',
      }),
      invalidatesTags: ['StorageDelivery', 'Payment', 'Card'],
    }),
    deleteStorageDelivery: build.mutation<void, StorageDeliveryIdDto>({
      query: ({ storageDeliveryId }) => ({
        url: `/storages-deliveries/${storageDeliveryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StorageDelivery', 'Card'],
    }),
    rateStorageDelivery: build.mutation<void, RateStorageDeliveryDto>({
      query: ({ storageDeliveryId, ...dto }) => ({
        url: `/storages-deliveries/${storageDeliveryId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['StorageDelivery'],
    }),
  }),
});

export const {
  useGetMainSDeliveriesQuery,
  useGetMySDeliveriesQuery,
  useGetTakenSDeliveriesQuery,
  useGetPlacedSDeliveriesQuery,
  useGetAllSDeliveriesQuery,
  useCreateStorageDeliveryMutation,
  useEditStorageDeliveryMutation,
  useTakeStorageDeliveryMutation,
  useUntakeStorageDeliveryMutation,
  useExecuteStorageDeliveryMutation,
  useCompleteStorageDeliveryMutation,
  useDeleteStorageDeliveryMutation,
  useRateStorageDeliveryMutation,
} = storagesDeliveriesApi;
