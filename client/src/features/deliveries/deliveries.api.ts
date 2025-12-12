import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import {
  CompleteDeliveryDto,
  CreateDeliveryDto,
  DeliveryIdDto,
  EditDeliveryDto,
  TakeDeliveryDto,
} from './delivery.dto';
import { getQuery } from '../../common/utils';

export const deliveriesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainDeliveries: build.query<IResponse<Delivery>, IRequest>({
      query: (req) => ({
        url: `/deliveries?${getQuery(req)}`,
      }),
      providesTags: ['Delivery'],
    }),
    getMyDeliveries: build.query<IResponse<Delivery>, IRequest>({
      query: (req) => ({
        url: `/deliveries/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Delivery'],
    }),
    getTakenDeliveries: build.query<IResponse<Delivery>, IRequest>({
      query: (req) => ({
        url: `/deliveries/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Delivery'],
    }),
    getAllDeliveries: build.query<IResponse<Delivery>, IRequest>({
      query: (req) => ({
        url: `/deliveries/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Delivery'],
    }),
    createDelivery: build.mutation<void, CreateDeliveryDto>({
      query: (dto) => ({
        url: '/deliveries',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Delivery', 'Payment', 'Card'],
    }),
    editDelivery: build.mutation<void, EditDeliveryDto>({
      query: ({ deliveryId, ...dto }) => ({
        url: `/deliveries/${deliveryId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Delivery', 'Card'],
    }),
    takeDelivery: build.mutation<void, TakeDeliveryDto>({
      query: ({ deliveryId, ...dto }) => ({
        url: `/deliveries/${deliveryId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Delivery'],
    }),
    untakeDelivery: build.mutation<void, DeliveryIdDto>({
      query: ({ deliveryId }) => ({
        url: `/deliveries/${deliveryId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Delivery'],
    }),
    executeDelivery: build.mutation<void, DeliveryIdDto>({
      query: ({ deliveryId }) => ({
        url: `/deliveries/${deliveryId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['Delivery'],
    }),
    completeDelivery: build.mutation<void, CompleteDeliveryDto>({
      query: ({ deliveryId, ...dto }) => ({
        url: `/deliveries/${deliveryId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Delivery', 'Payment', 'Card'],
    }),
    deleteDelivery: build.mutation<void, DeliveryIdDto>({
      query: ({ deliveryId }) => ({
        url: `/deliveries/${deliveryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Delivery', 'Card'],
    }),
  }),
});

export const {
  useGetMainDeliveriesQuery,
  useGetMyDeliveriesQuery,
  useGetTakenDeliveriesQuery,
  useGetAllDeliveriesQuery,
  useCreateDeliveryMutation,
  useEditDeliveryMutation,
  useTakeDeliveryMutation,
  useUntakeDeliveryMutation,
  useExecuteDeliveryMutation,
  useCompleteDeliveryMutation,
  useDeleteDeliveryMutation,
} = deliveriesApi;
