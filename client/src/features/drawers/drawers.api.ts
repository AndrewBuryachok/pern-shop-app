import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Drawer, SmDrawer } from './drawer.model';
import { SmStationWithPrice } from '../stations/station.model';
import { CreateDrawerDto } from './drawer.dto';
import { getQuery } from '../../common/utils';

export const drawersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainDrawers: build.query<IResponse<Drawer>, IRequest>({
      query: (req) => ({
        url: `/drawers?${getQuery(req)}`,
      }),
      providesTags: ['Drawer'],
    }),
    getMyDrawers: build.query<IResponse<Drawer>, IRequest>({
      query: (req) => ({
        url: `/drawers/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Drawer'],
    }),
    getAllDrawers: build.query<IResponse<Drawer>, IRequest>({
      query: (req) => ({
        url: `/drawers/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Drawer'],
    }),
    selectStationDrawers: build.query<SmDrawer[], number>({
      query: (stationId) => ({
        url: `/drawers/${stationId}/select`,
      }),
      providesTags: ['Drawer'],
    }),
    selectDrawerStation: build.query<SmStationWithPrice, number>({
      query: (drawerId) => ({
        url: `/drawers/${drawerId}/station`,
      }),
      providesTags: ['Station'],
    }),
    createDrawer: build.mutation<void, CreateDrawerDto>({
      query: (dto) => ({
        url: '/drawers',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Drawer'],
    }),
  }),
});

export const {
  useGetMainDrawersQuery,
  useGetMyDrawersQuery,
  useGetAllDrawersQuery,
  useSelectStationDrawersQuery,
  useSelectDrawerStationQuery,
  useCreateDrawerMutation,
} = drawersApi;
