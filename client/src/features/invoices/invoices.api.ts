import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import {
  CompleteInvoiceDto,
  CreateInvoiceDto,
  DeleteInvoiceDto,
} from './invoice.dto';
import { getQuery } from '../../common/utils';

export const invoicesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyInvoices: build.query<IResponse<Invoice>, IRequest>({
      query: (req) => ({
        url: `/invoices/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Invoice'],
    }),
    getAllInvoices: build.query<IResponse<Invoice>, IRequest>({
      query: (req) => ({
        url: `/invoices/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Invoice'],
    }),
    createInvoice: build.mutation<void, CreateInvoiceDto>({
      query: (dto) => ({
        url: '/invoices',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Invoice'],
    }),
    completeInvoice: build.mutation<void, CompleteInvoiceDto>({
      query: ({ invoiceId, ...dto }) => ({
        url: `/invoices/${invoiceId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Invoice', 'Payment', 'Card'],
    }),
    deleteInvoice: build.mutation<void, DeleteInvoiceDto>({
      query: ({ invoiceId }) => ({
        url: `/invoices/${invoiceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useGetMyInvoicesQuery,
  useGetAllInvoicesQuery,
  useCreateInvoiceMutation,
  useCompleteInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi;
