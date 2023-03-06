import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Payment } from './payment.model';
import { CreatePaymentDto } from './payment.dto';
import { getQuery } from '../../common/utils';

export const paymentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyPayments: build.query<IResponse<Payment>, IRequest>({
      query: (req) => ({
        url: `/payments/my?${getQuery(req)}`,
      }),
      providesTags: ['Payment'],
    }),
    getAllPayments: build.query<IResponse<Payment>, IRequest>({
      query: (req) => ({
        url: `/payments/all?${getQuery(req)}`,
      }),
      providesTags: ['Payment'],
    }),
    createPayment: build.mutation<void, CreatePaymentDto>({
      query: (dto) => ({
        url: '/payments',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Payment', 'Card'],
    }),
  }),
});

export const {
  useGetMyPaymentsQuery,
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
} = paymentsApi;
