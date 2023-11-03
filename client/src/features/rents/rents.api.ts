import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Rent, SelectRent } from './rent.model';
import { CreateRentDto } from './rent.dto';
import { getQuery } from '../../common/utils';

export const rentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyRents: build.query<IResponse<Rent>, IRequest>({
      query: (req) => ({
        url: `/rents/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Rent', 'Ware'],
    }),
    getAllRents: build.query<IResponse<Rent>, IRequest>({
      query: (req) => ({
        url: `/rents/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Rent', 'Ware'],
    }),
    selectAllRents: build.query<SelectRent[], void>({
      query: () => ({
        url: '/rents/all/select',
      }),
      providesTags: ['Auth', 'Rent'],
    }),
    selectMyRents: build.query<SelectRent[], void>({
      query: () => ({
        url: '/rents/my/select',
      }),
      providesTags: ['Auth', 'Rent'],
    }),
    createRent: build.mutation<void, CreateRentDto>({
      query: (dto) => ({
        url: '/rents',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Rent', 'Store', 'Payment', 'Card'],
    }),
  }),
});

export const {
  useGetMyRentsQuery,
  useGetAllRentsQuery,
  useSelectAllRentsQuery,
  useSelectMyRentsQuery,
  useCreateRentMutation,
} = rentsApi;
