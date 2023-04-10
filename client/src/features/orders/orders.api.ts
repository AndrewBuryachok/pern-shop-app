import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Order } from './order.model';
import { CreateOrderDto, OrderIdDto, TakeOrderDto } from './order.dto';
import { getQuery } from '../../common/utils';

export const ordersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainOrders: build.query<IResponse<Order>, IRequest>({
      query: (req) => ({
        url: `/orders?${getQuery(req)}`,
      }),
      providesTags: ['Active', 'Order'],
    }),
    getMyOrders: build.query<IResponse<Order>, IRequest>({
      query: (req) => ({
        url: `/orders/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Order'],
    }),
    getTakenOrders: build.query<IResponse<Order>, IRequest>({
      query: (req) => ({
        url: `/orders/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Order'],
    }),
    getPlacedOrders: build.query<IResponse<Order>, IRequest>({
      query: (req) => ({
        url: `/orders/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Order'],
    }),
    getAllOrders: build.query<IResponse<Order>, IRequest>({
      query: (req) => ({
        url: `/orders/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Order'],
    }),
    createOrder: build.mutation<void, CreateOrderDto>({
      query: (dto) => ({
        url: '/orders',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Order', 'Cell', 'Card'],
    }),
    takeOrder: build.mutation<void, TakeOrderDto>({
      query: ({ orderId, ...dto }) => ({
        url: `/orders/${orderId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Order'],
    }),
    untakeOrder: build.mutation<void, OrderIdDto>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    executeOrder: build.mutation<void, OrderIdDto>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
    completeOrder: build.mutation<void, OrderIdDto>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Order', 'Payment', 'Card'],
    }),
    deleteOrder: build.mutation<void, OrderIdDto>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order', 'Card'],
    }),
  }),
});

export const {
  useGetMainOrdersQuery,
  useGetMyOrdersQuery,
  useGetTakenOrdersQuery,
  useGetPlacedOrdersQuery,
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useTakeOrderMutation,
  useUntakeOrderMutation,
  useExecuteOrderMutation,
  useCompleteOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
