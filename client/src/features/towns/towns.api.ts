import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { SmTown, Town } from './town.model';
import { SmUser } from '../users/user.model';
import {
  CreateTownDto,
  EditTownDto,
  ExtCreateTownDto,
  TownIdDto,
} from './town.dto';
import { getQuery } from '../../common/utils';

export const townsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainTowns: build.query<IResponse<Town>, IRequest>({
      query: (req) => ({
        url: `/towns?${getQuery(req)}`,
      }),
      providesTags: ['Town'],
    }),
    getMyTowns: build.query<IResponse<Town>, IRequest>({
      query: (req) => ({
        url: `/towns/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Town'],
    }),
    getAllTowns: build.query<IResponse<Town>, IRequest>({
      query: (req) => ({
        url: `/towns/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Town'],
    }),
    selectAllTowns: build.query<SmTown[], void>({
      query: () => ({
        url: '/towns/all/select',
      }),
      providesTags: ['Town'],
    }),
    selectMyTowns: build.query<SmTown[], void>({
      query: () => ({
        url: '/towns/my/select',
      }),
      providesTags: ['Auth', 'Town'],
    }),
    selectTownUsers: build.query<SmUser[], number>({
      query: (townId) => ({
        url: `/towns/${townId}/users`,
      }),
      providesTags: ['Town'],
    }),
    createMyTown: build.mutation<void, CreateTownDto>({
      query: (dto) => ({
        url: '/towns',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Town', 'User'],
    }),
    createUserTown: build.mutation<void, ExtCreateTownDto>({
      query: (dto) => ({
        url: '/towns/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Town', 'User'],
    }),
    editTown: build.mutation<void, EditTownDto>({
      query: ({ townId, ...dto }) => ({
        url: `/towns/${townId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Town'],
    }),
    deleteTown: build.mutation<void, TownIdDto>({
      query: ({ townId }) => ({
        url: `/towns/${townId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Town', 'Resident'],
    }),
  }),
});

export const {
  useGetMainTownsQuery,
  useGetMyTownsQuery,
  useGetAllTownsQuery,
  useSelectAllTownsQuery,
  useSelectMyTownsQuery,
  useSelectTownUsersQuery,
  useCreateMyTownMutation,
  useCreateUserTownMutation,
  useEditTownMutation,
  useDeleteTownMutation,
} = townsApi;
