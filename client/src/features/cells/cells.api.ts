import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Cell } from './cell.model';
import { CreateCellDto } from './cell.dto';
import { getQuery } from '../../common/utils';

export const cellsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainCells: build.query<IResponse<Cell>, IRequest>({
      query: (req) => ({
        url: `/cells?${getQuery(req)}`,
      }),
      providesTags: ['Cell'],
    }),
    getMyCells: build.query<IResponse<Cell>, IRequest>({
      query: (req) => ({
        url: `/cells/my?${getQuery(req)}`,
      }),
      providesTags: ['Cell'],
    }),
    getAllCells: build.query<IResponse<Cell>, IRequest>({
      query: (req) => ({
        url: `/cells/all?${getQuery(req)}`,
      }),
      providesTags: ['Cell'],
    }),
    createCell: build.mutation<void, CreateCellDto>({
      query: (dto) => ({
        url: '/cells',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Cell', 'Storage'],
    }),
  }),
});

export const {
  useGetMainCellsQuery,
  useGetMyCellsQuery,
  useGetAllCellsQuery,
  useCreateCellMutation,
} = cellsApi;
