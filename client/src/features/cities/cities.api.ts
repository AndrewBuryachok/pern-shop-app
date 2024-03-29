import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { City, SmCity } from './city.model';
import {
  CreateCityDto,
  EditCityDto,
  ExtCreateCityDto,
  UpdateCityUserDto,
} from './city.dto';
import { getQuery } from '../../common/utils';

export const citiesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainCities: build.query<IResponse<City>, IRequest>({
      query: (req) => ({
        url: `/cities?${getQuery(req)}`,
      }),
      providesTags: ['City'],
    }),
    getMyCities: build.query<IResponse<City>, IRequest>({
      query: (req) => ({
        url: `/cities/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'City'],
    }),
    getAllCities: build.query<IResponse<City>, IRequest>({
      query: (req) => ({
        url: `/cities/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'City'],
    }),
    selectAllCities: build.query<SmCity[], void>({
      query: () => ({
        url: '/cities/all/select',
      }),
      providesTags: ['City'],
    }),
    selectMyCities: build.query<SmCity[], void>({
      query: () => ({
        url: '/cities/my/select',
      }),
      providesTags: ['Auth', 'City'],
    }),
    createMyCity: build.mutation<void, CreateCityDto>({
      query: (dto) => ({
        url: '/cities',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['City'],
    }),
    createUserCity: build.mutation<void, ExtCreateCityDto>({
      query: (dto) => ({
        url: '/cities/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['City'],
    }),
    editCity: build.mutation<void, EditCityDto>({
      query: ({ cityId, ...dto }) => ({
        url: `/cities/${cityId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['City'],
    }),
    addCityUser: build.mutation<void, UpdateCityUserDto>({
      query: ({ cityId, ...dto }) => ({
        url: `/cities/${cityId}/users`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['City'],
    }),
    removeCityUser: build.mutation<void, UpdateCityUserDto>({
      query: ({ cityId, ...dto }) => ({
        url: `/cities/${cityId}/users`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['City'],
    }),
  }),
});

export const {
  useGetMainCitiesQuery,
  useGetMyCitiesQuery,
  useGetAllCitiesQuery,
  useSelectAllCitiesQuery,
  useSelectMyCitiesQuery,
  useCreateMyCityMutation,
  useCreateUserCityMutation,
  useEditCityMutation,
  useAddCityUserMutation,
  useRemoveCityUserMutation,
} = citiesApi;
