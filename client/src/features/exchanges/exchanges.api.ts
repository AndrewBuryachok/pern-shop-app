import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import { CreateExchangeDto } from './exchange.dto';
import { getQuery } from '../../common/utils';

export const exchangesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyExchanges: build.query<IResponse<Exchange>, IRequest>({
      query: (req) => ({
        url: `/exchanges/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Exchange'],
    }),
    getAllExchanges: build.query<IResponse<Exchange>, IRequest>({
      query: (req) => ({
        url: `/exchanges/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Exchange'],
    }),
    createExchange: build.mutation<void, CreateExchangeDto>({
      query: (dto) => ({
        url: '/exchanges',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Exchange', 'Card'],
    }),
  }),
});

export const {
  useGetMyExchangesQuery,
  useGetAllExchangesQuery,
  useCreateExchangeMutation,
} = exchangesApi;
