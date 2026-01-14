import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import { CreateTransactionDto, DeleteTransactionDto } from './transaction.dto';
import { getQuery } from '../../common/utils';

export const transactionsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyTransactions: build.query<IResponse<Transaction>, IRequest>({
      query: (req) => ({
        url: `/transactions/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Transaction'],
    }),
    getAllTransactions: build.query<IResponse<Transaction>, IRequest>({
      query: (req) => ({
        url: `/transactions/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Transaction'],
    }),
    createTransaction: build.mutation<void, CreateTransactionDto>({
      query: (dto) => ({
        url: '/transactions',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Transaction', 'Card'],
    }),
    deleteTransaction: build.mutation<void, DeleteTransactionDto>({
      query: ({ transactionId }) => ({
        url: `/transactions/${transactionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction', 'Card'],
    }),
  }),
});

export const {
  useGetMyTransactionsQuery,
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
