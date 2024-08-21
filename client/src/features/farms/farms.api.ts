import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Farm, SmFarm } from './farm.model';
import { SmUser } from '../users/user.model';
import {
  CreateFarmDto,
  EditFarmDto,
  ExtCreateFarmDto,
  UpdateFarmUserDto,
} from './farm.dto';
import { getQuery } from '../../common/utils';

export const farmsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainFarms: build.query<IResponse<Farm>, IRequest>({
      query: (req) => ({
        url: `/farms?${getQuery(req)}`,
      }),
      providesTags: ['Farm'],
    }),
    getMyFarms: build.query<IResponse<Farm>, IRequest>({
      query: (req) => ({
        url: `/farms/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Farm'],
    }),
    getAllFarms: build.query<IResponse<Farm>, IRequest>({
      query: (req) => ({
        url: `/farms/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Farm'],
    }),
    selectAllFarms: build.query<SmFarm[], void>({
      query: () => ({
        url: '/farms/all/select',
      }),
      providesTags: ['Farm'],
    }),
    selectMyFarms: build.query<SmFarm[], void>({
      query: () => ({
        url: '/farms/my/select',
      }),
      providesTags: ['Auth', 'Farm'],
    }),
    selectFarmUsers: build.query<SmUser[], number>({
      query: (farmId) => ({
        url: `/farms/${farmId}/users`,
      }),
      providesTags: ['Farm'],
    }),
    createMyFarm: build.mutation<void, CreateFarmDto>({
      query: (dto) => ({
        url: '/farms',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Farm'],
    }),
    createUserFarm: build.mutation<void, ExtCreateFarmDto>({
      query: (dto) => ({
        url: '/farms/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Farm'],
    }),
    editFarm: build.mutation<void, EditFarmDto>({
      query: ({ farmId, ...dto }) => ({
        url: `/farms/${farmId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Farm'],
    }),
    addFarmUser: build.mutation<void, UpdateFarmUserDto>({
      query: ({ farmId, ...dto }) => ({
        url: `/farms/${farmId}/users`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Farm'],
    }),
    removeFarmUser: build.mutation<void, UpdateFarmUserDto>({
      query: ({ farmId, ...dto }) => ({
        url: `/farms/${farmId}/users`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['Farm'],
    }),
  }),
});

export const {
  useGetMainFarmsQuery,
  useGetMyFarmsQuery,
  useGetAllFarmsQuery,
  useSelectAllFarmsQuery,
  useSelectMyFarmsQuery,
  useSelectFarmUsersQuery,
  useCreateMyFarmMutation,
  useCreateUserFarmMutation,
  useEditFarmMutation,
  useAddFarmUserMutation,
  useRemoveFarmUserMutation,
} = farmsApi;
