import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import {
  CreateMarketDeliveryDto,
  EditMarketDeliveryDto,
  MarketDeliveryIdDto,
  RateMarketDeliveryDto,
  TakeMarketDeliveryDto,
} from './market-delivery.dto';
import { getQuery } from '../../common/utils';

export const marketsDeliveriesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainMDeliveries: build.query<IResponse<MarketDelivery>, IRequest>({
      query: (req) => ({
        url: `/markets-deliveries?${getQuery(req)}`,
      }),
      providesTags: ['MarketDelivery'],
    }),
    getMyMDeliveries: build.query<IResponse<MarketDelivery>, IRequest>({
      query: (req) => ({
        url: `/markets-deliveries/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketDelivery'],
    }),
    getTakenMDeliveries: build.query<IResponse<MarketDelivery>, IRequest>({
      query: (req) => ({
        url: `/markets-deliveries/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketDelivery'],
    }),
    getPlacedMDeliveries: build.query<IResponse<MarketDelivery>, IRequest>({
      query: (req) => ({
        url: `/markets-deliveries/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketDelivery'],
    }),
    getAllMDeliveries: build.query<IResponse<MarketDelivery>, IRequest>({
      query: (req) => ({
        url: `/markets-deliveries/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'MarketDelivery'],
    }),
    createMarketDelivery: build.mutation<void, CreateMarketDeliveryDto>({
      query: (dto) => ({
        url: '/markets-deliveries',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['MarketDelivery', 'Hire', 'Drawer', 'Payment', 'Card'],
    }),
    editMarketDelivery: build.mutation<void, EditMarketDeliveryDto>({
      query: ({ marketDeliveryId, ...dto }) => ({
        url: `/markets-deliveries/${marketDeliveryId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['MarketDelivery', 'Card'],
    }),
    takeMarketDelivery: build.mutation<void, TakeMarketDeliveryDto>({
      query: ({ marketDeliveryId, ...dto }) => ({
        url: `/markets-deliveries/${marketDeliveryId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['MarketDelivery'],
    }),
    untakeMarketDelivery: build.mutation<void, MarketDeliveryIdDto>({
      query: ({ marketDeliveryId }) => ({
        url: `/markets-deliveries/${marketDeliveryId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MarketDelivery'],
    }),
    executeMarketDelivery: build.mutation<void, MarketDeliveryIdDto>({
      query: ({ marketDeliveryId }) => ({
        url: `/markets-deliveries/${marketDeliveryId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['MarketDelivery'],
    }),
    completeMarketDelivery: build.mutation<void, MarketDeliveryIdDto>({
      query: ({ marketDeliveryId }) => ({
        url: `/markets-deliveries/${marketDeliveryId}`,
        method: 'POST',
      }),
      invalidatesTags: ['MarketDelivery', 'Payment', 'Card'],
    }),
    deleteMarketDelivery: build.mutation<void, MarketDeliveryIdDto>({
      query: ({ marketDeliveryId }) => ({
        url: `/markets-deliveries/${marketDeliveryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MarketDelivery', 'Card'],
    }),
    rateMarketDelivery: build.mutation<void, RateMarketDeliveryDto>({
      query: ({ marketDeliveryId, ...dto }) => ({
        url: `/markets-deliveries/${marketDeliveryId}/rate`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['MarketDelivery'],
    }),
  }),
});

export const {
  useGetMainMDeliveriesQuery,
  useGetMyMDeliveriesQuery,
  useGetTakenMDeliveriesQuery,
  useGetPlacedMDeliveriesQuery,
  useGetAllMDeliveriesQuery,
  useCreateMarketDeliveryMutation,
  useEditMarketDeliveryMutation,
  useTakeMarketDeliveryMutation,
  useUntakeMarketDeliveryMutation,
  useExecuteMarketDeliveryMutation,
  useCompleteMarketDeliveryMutation,
  useDeleteMarketDeliveryMutation,
  useRateMarketDeliveryMutation,
} = marketsDeliveriesApi;
