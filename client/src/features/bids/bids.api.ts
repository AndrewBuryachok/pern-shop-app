import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Bid } from './bid.model';
import { CreateBidDto } from './bid.dto';
import { getQuery } from '../../common/utils';

export const bidsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyBids: build.query<IResponse<Bid>, IRequest>({
      query: (req) => ({
        url: `/bids/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bid'],
    }),
    getSoldBids: build.query<IResponse<Bid>, IRequest>({
      query: (req) => ({
        url: `/bids/sold?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bid'],
    }),
    getPlacedBids: build.query<IResponse<Bid>, IRequest>({
      query: (req) => ({
        url: `/bids/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bid'],
    }),
    getAllBids: build.query<IResponse<Bid>, IRequest>({
      query: (req) => ({
        url: `/bids/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Bid'],
    }),
    createBid: build.mutation<void, CreateBidDto>({
      query: (dto) => ({
        url: '/bids',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Bid', 'Lot', 'Card'],
    }),
  }),
});

export const {
  useGetMyBidsQuery,
  useGetSoldBidsQuery,
  useGetPlacedBidsQuery,
  useGetAllBidsQuery,
  useCreateBidMutation,
} = bidsApi;
