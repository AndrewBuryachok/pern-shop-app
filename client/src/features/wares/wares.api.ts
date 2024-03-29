import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Ware } from './ware.model';
import { CompleteWareDto, CreateWareDto, EditWareDto } from './ware.dto';
import { getQuery } from '../../common/utils';

export const waresApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getWaresStats: build.query<number, void>({
      query: () => ({
        url: '/wares/stats',
      }),
      providesTags: ['Ware'],
    }),
    getMainWares: build.query<IResponse<Ware>, IRequest>({
      query: (req) => ({
        url: `/wares?${getQuery(req)}`,
      }),
      providesTags: ['Ware'],
    }),
    getMyWares: build.query<IResponse<Ware>, IRequest>({
      query: (req) => ({
        url: `/wares/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Ware'],
    }),
    getPlacedWares: build.query<IResponse<Ware>, IRequest>({
      query: (req) => ({
        url: `/wares/placed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Ware'],
    }),
    getAllWares: build.query<IResponse<Ware>, IRequest>({
      query: (req) => ({
        url: `/wares/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Ware'],
    }),
    createWare: build.mutation<void, CreateWareDto>({
      query: (dto) => ({
        url: '/wares',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Ware'],
    }),
    editWare: build.mutation<void, EditWareDto>({
      query: ({ wareId, ...dto }) => ({
        url: `/wares/${wareId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Ware'],
    }),
    completeWare: build.mutation<void, CompleteWareDto>({
      query: ({ wareId }) => ({
        url: `/wares/${wareId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Ware'],
    }),
  }),
});

export const {
  useGetWaresStatsQuery,
  useGetMainWaresQuery,
  useGetMyWaresQuery,
  useGetPlacedWaresQuery,
  useGetAllWaresQuery,
  useCreateWareMutation,
  useEditWareMutation,
  useCompleteWareMutation,
} = waresApi;
