import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import {
  MyStation,
  SmStation,
  SmStationWithPrice,
  Station,
} from './station.model';
import { State } from '../states/state.model';
import { CreateStationDto, EditStationDto } from './station.dto';
import { getQuery } from '../../common/utils';

export const stationsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainStations: build.query<IResponse<Station>, IRequest>({
      query: (req) => ({
        url: `/stations?${getQuery(req)}`,
      }),
      providesTags: ['Station'],
    }),
    getMyStations: build.query<IResponse<Station>, IRequest>({
      query: (req) => ({
        url: `/stations/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Station'],
    }),
    getAllStations: build.query<IResponse<Station>, IRequest>({
      query: (req) => ({
        url: `/stations/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Station'],
    }),
    selectMainStations: build.query<SmStation[], void>({
      query: () => ({
        url: '/stations/main/select',
      }),
      providesTags: ['Station'],
    }),
    selectMyStations: build.query<MyStation[], void>({
      query: () => ({
        url: '/stations/my/select',
      }),
      providesTags: ['Auth', 'Station', 'Box'],
    }),
    selectAllStations: build.query<MyStation[], void>({
      query: () => ({
        url: '/stations/all/select',
      }),
      providesTags: ['Auth', 'Station', 'Box'],
    }),
    selectFreeStations: build.query<SmStationWithPrice[], void>({
      query: () => ({
        url: '/stations/free/select',
      }),
      providesTags: ['Station', 'Box'],
    }),
    selectStationStates: build.query<State[], number>({
      query: (stationId) => ({
        url: `/stations/${stationId}/states`,
      }),
      providesTags: ['Station'],
    }),
    createStation: build.mutation<void, CreateStationDto>({
      query: (dto) => ({
        url: '/stations',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Station'],
    }),
    editStation: build.mutation<void, EditStationDto>({
      query: ({ stationId, ...dto }) => ({
        url: `/stations/${stationId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Station'],
    }),
  }),
});

export const {
  useGetMainStationsQuery,
  useGetMyStationsQuery,
  useGetAllStationsQuery,
  useSelectMainStationsQuery,
  useSelectMyStationsQuery,
  useSelectAllStationsQuery,
  useSelectFreeStationsQuery,
  useSelectStationStatesQuery,
  useCreateStationMutation,
  useEditStationMutation,
} = stationsApi;
