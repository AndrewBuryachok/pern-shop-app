import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import {
  CreateTransactionDto,
  CreateTransferDto,
  DeleteTransactionDto,
} from './transaction.dto';
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
    createDeposit: build.mutation<void, CreateTransactionDto>({
      query: (dto) => ({
        url: '/transactions/deposit',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Transaction', 'Card'],
    }),
    createWithdraw: build.mutation<void, CreateTransactionDto>({
      query: (dto) => ({
        url: '/transactions/withdraw',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Transaction', 'Card'],
    }),
    createTransfer: build.mutation<void, CreateTransferDto>({
      query: (dto) => ({
        url: '/transactions/transfer',
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
  useCreateDepositMutation,
  useCreateWithdrawMutation,
  useCreateTransferMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
