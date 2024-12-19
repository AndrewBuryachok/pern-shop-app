import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Box, SmBox } from './box.model';
import { SmStationWithPrice } from '../stations/station.model';
import { CreateBoxDto } from './box.dto';
import { getQuery } from '../../common/utils';

export const boxesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainBoxes: build.query<IResponse<Box>, IRequest>({
      query: (req) => ({
        url: `/boxes?${getQuery(req)}`,
      }),
      providesTags: ['Box'],
    }),
    getMyBoxes: build.query<IResponse<Box>, IRequest>({
      query: (req) => ({
        url: `/boxes/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Box'],
    }),
    getAllBoxes: build.query<IResponse<Box>, IRequest>({
      query: (req) => ({
        url: `/boxes/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Box'],
    }),
    selectStationBoxes: build.query<SmBox[], number>({
      query: (stationId) => ({
        url: `/boxes/${stationId}/select`,
      }),
      providesTags: ['Box'],
    }),
    selectBoxStation: build.query<SmStationWithPrice, number>({
      query: (boxId) => ({
        url: `/boxes/${boxId}/station`,
      }),
      providesTags: ['Station'],
    }),
    createBox: build.mutation<void, CreateBoxDto>({
      query: (dto) => ({
        url: '/boxes',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Box'],
    }),
  }),
});

export const {
  useGetMainBoxesQuery,
  useGetMyBoxesQuery,
  useGetAllBoxesQuery,
  useSelectStationBoxesQuery,
  useSelectBoxStationQuery,
  useCreateBoxMutation,
} = boxesApi;
