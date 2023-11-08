import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Cell, SmCell } from './cell.model';
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
      providesTags: ['Auth', 'Cell'],
    }),
    getAllCells: build.query<IResponse<Cell>, IRequest>({
      query: (req) => ({
        url: `/cells/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Cell'],
    }),
    selectStorageCells: build.query<SmCell[], number>({
      query: (userId) => ({
        url: `/cells/${userId}/select`,
      }),
      providesTags: ['Cell'],
    }),
    createCell: build.mutation<void, CreateCellDto>({
      query: (dto) => ({
        url: '/cells',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Cell'],
    }),
  }),
});

export const {
  useGetMainCellsQuery,
  useGetMyCellsQuery,
  useGetAllCellsQuery,
  useSelectStorageCellsQuery,
  useCreateCellMutation,
} = cellsApi;
