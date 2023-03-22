import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse, IStats } from '../../common/interfaces';
import { Ware } from './ware.model';
import { CreateWareDto } from './ware.dto';
import { getQuery } from '../../common/utils';

export const waresApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getWaresStats: build.query<IStats, void>({
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
      providesTags: ['Ware'],
    }),
    getAllWares: build.query<IResponse<Ware>, IRequest>({
      query: (req) => ({
        url: `/wares/all?${getQuery(req)}`,
      }),
      providesTags: ['Ware'],
    }),
    createWare: build.mutation<void, CreateWareDto>({
      query: (dto) => ({
        url: '/wares',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Ware', 'Rent'],
    }),
  }),
});

export const {
  useGetWaresStatsQuery,
  useGetMainWaresQuery,
  useGetMyWaresQuery,
  useGetAllWaresQuery,
  useCreateWareMutation,
} = waresApi;
