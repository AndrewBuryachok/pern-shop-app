import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { City, SmCity } from './city.model';
import { SmUser } from '../users/user.model';
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
    selectCityUsers: build.query<SmUser[], number>({
      query: (cityId) => ({
        url: `/cities/${cityId}/users`,
      }),
      providesTags: ['City'],
    }),
    createMyCity: build.mutation<void, CreateCityDto>({
      query: (dto) => ({
        url: '/cities',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['City', 'User'],
    }),
    createUserCity: build.mutation<void, ExtCreateCityDto>({
      query: (dto) => ({
        url: '/cities/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['City', 'User'],
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
      invalidatesTags: ['City', 'User'],
    }),
    removeCityUser: build.mutation<void, UpdateCityUserDto>({
      query: ({ cityId, ...dto }) => ({
        url: `/cities/${cityId}/users`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['City', 'User'],
    }),
  }),
});

export const {
  useGetMainCitiesQuery,
  useGetMyCitiesQuery,
  useGetAllCitiesQuery,
  useSelectAllCitiesQuery,
  useSelectMyCitiesQuery,
  useSelectCityUsersQuery,
  useCreateMyCityMutation,
  useCreateUserCityMutation,
  useEditCityMutation,
  useAddCityUserMutation,
  useRemoveCityUserMutation,
} = citiesApi;
