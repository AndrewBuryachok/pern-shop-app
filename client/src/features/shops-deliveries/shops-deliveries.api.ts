import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import {
  CreateShopDeliveryDto,
  EditShopDeliveryDto,
  RateShopDeliveryDto,
  ShopDeliveryIdDto,
  TakeShopDeliveryDto,
} from './shop-delivery.dto';
import { getQuery } from '../../common/utils';

export const shopsDeliveriesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainMDeliveries: build.query<IResponse<ShopDelivery>, IRequest>({
      query: (req) => ({
        url: `/shops-deliveries?${getQuery(req)}`,
      }),
      providesTags: ['ShopDelivery'],
    }),
    getMyMDeliveries: build.query<IResponse<ShopDelivery>, IRequest>({
      query: (req) => ({
        url: `/shops-deliveries/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'ShopDelivery'],
    }),
    getTakenMDeliveries: build.query<IResponse<ShopDelivery>, IRequest>({
      query: (req) => ({
        url: `/shops-deliveries/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'ShopDelivery'],
    }),
    getPlacedMDeliveries: build.query<IResponse<ShopDelivery>, IRequest>({
      query: (req) => ({
        url: `/shops-deliveries/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'ShopDelivery'],
    }),
    getAllMDeliveries: build.query<IResponse<ShopDelivery>, IRequest>({
      query: (req) => ({
        url: `/shops-deliveries/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'ShopDelivery'],
    }),
    createShopDelivery: build.mutation<void, CreateShopDeliveryDto>({
      query: (dto) => ({
        url: '/shops-deliveries',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ShopDelivery', 'Hire', 'Box', 'Payment', 'Card'],
    }),
    editShopDelivery: build.mutation<void, EditShopDeliveryDto>({
      query: ({ shopDeliveryId, ...dto }) => ({
        url: `/shops-deliveries/${shopDeliveryId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ShopDelivery', 'Card'],
    }),
    takeShopDelivery: build.mutation<void, TakeShopDeliveryDto>({
      query: ({ shopDeliveryId, ...dto }) => ({
        url: `/shops-deliveries/${shopDeliveryId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ShopDelivery'],
    }),
    untakeShopDelivery: build.mutation<void, ShopDeliveryIdDto>({
      query: ({ shopDeliveryId }) => ({
        url: `/shops-deliveries/${shopDeliveryId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShopDelivery'],
    }),
    executeShopDelivery: build.mutation<void, ShopDeliveryIdDto>({
      query: ({ shopDeliveryId }) => ({
        url: `/shops-deliveries/${shopDeliveryId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['ShopDelivery'],
    }),
    completeShopDelivery: build.mutation<void, ShopDeliveryIdDto>({
      query: ({ shopDeliveryId }) => ({
        url: `/shops-deliveries/${shopDeliveryId}`,
        method: 'POST',
      }),
      invalidatesTags: ['ShopDelivery', 'Payment', 'Card'],
    }),
    deleteShopDelivery: build.mutation<void, ShopDeliveryIdDto>({
      query: ({ shopDeliveryId }) => ({
        url: `/shops-deliveries/${shopDeliveryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShopDelivery', 'Card'],
    }),
    rateShopDelivery: build.mutation<void, RateShopDeliveryDto>({
      query: ({ shopDeliveryId, ...dto }) => ({
        url: `/shops-deliveries/${shopDeliveryId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ShopDelivery'],
    }),
  }),
});

export const {
  useGetMainMDeliveriesQuery,
  useGetMyMDeliveriesQuery,
  useGetTakenMDeliveriesQuery,
  useGetPlacedMDeliveriesQuery,
  useGetAllMDeliveriesQuery,
  useCreateShopDeliveryMutation,
  useEditShopDeliveryMutation,
  useTakeShopDeliveryMutation,
  useUntakeShopDeliveryMutation,
  useExecuteShopDeliveryMutation,
  useCompleteShopDeliveryMutation,
  useDeleteShopDeliveryMutation,
  useRateShopDeliveryMutation,
} = shopsDeliveriesApi;
