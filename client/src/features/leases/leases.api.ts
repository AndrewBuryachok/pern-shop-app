import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Lease } from './lease.model';
import { getQuery } from '../../common/utils';

export const leasesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease', 'Product'],
    }),
    getAllLeases: build.query<IResponse<Lease>, IRequest>({
      query: (req) => ({
        url: `/leases/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Lease', 'Product'],
    }),
  }),
});

export const { useGetMyLeasesQuery, useGetAllLeasesQuery } = leasesApi;
