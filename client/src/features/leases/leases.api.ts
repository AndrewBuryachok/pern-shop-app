import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Lease } from './lease.model';
import { MdThing } from '../things/thing.model';
import { LeaseIdDto } from './lease.dto';
import { getQuery } from '../../common/utils';

export const leasesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases?${getQuery(req)}`,
      }),
      providesTags: ['Lease'],
    }),
    getMyLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    getReceivedLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    getAllLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease'],
    }),
    selectLeaseThings: build.query<MdThing[], number>({
      query: (leaseId) => ({
        url: `/leases/${leaseId}/things`,
      }),
      providesTags: ['Lease'],
    }),
    continueLease: build.mutation<void, LeaseIdDto>({
      query: ({ leaseId }) => ({
        url: `/leases/${leaseId}/continue`,
        method: 'POST',
      }),
      invalidatesTags: ['Lease', 'Cell', 'Payment', 'Card'],
    }),
    completeLease: build.mutation<void, LeaseIdDto>({
      query: ({ leaseId }) => ({
        url: `/leases/${leaseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Lease'],
    }),
  }),
});

export const {
  useGetMainLeasesQuery,
  useGetMyLeasesQuery,
  useGetReceivedLeasesQuery,
  useGetAllLeasesQuery,
  useSelectLeaseThingsQuery,
  useContinueLeaseMutation,
  useCompleteLeaseMutation,
} = leasesApi;
