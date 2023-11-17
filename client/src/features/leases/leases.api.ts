import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Lease } from './lease.model';
import { CompleteLeaseDto } from './lease.dto';
import { getQuery } from '../../common/utils';

export const leasesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    getPlacedLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    getAllLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    completeLease: build.mutation<void, CompleteLeaseDto>({
      query: ({ leaseId }) => ({
        url: `/leases/${leaseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Lease'],
    }),
  }),
});

export const {
  useGetMyLeasesQuery,
  useGetPlacedLeasesQuery,
  useGetAllLeasesQuery,
  useCompleteLeaseMutation,
} = leasesApi;
