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
      query: (storageId) => ({
        url: `/cells/${storageId}/storages`,
      }),
      providesTags: ['Cell'],
    }),
    selectTagCells: build.query<SmCell[], number>({
      query: (storageTagId) => ({
        url: `/cells/${storageTagId}/tags`,
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
  useSelectTagCellsQuery,
  useCreateCellMutation,
} = cellsApi;
