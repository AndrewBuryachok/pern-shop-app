import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Hire } from './hire.model';
import { MdThing } from '../things/thing.model';
import { HireIdDto } from './hire.dto';
import { getQuery } from '../../common/utils';

export const hiresApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainHires: build.query<IResponse<Hire>, IRequest>({
      query: (req) => ({
        url: `/hires?${getQuery(req)}`,
      }),
      providesTags: ['Hire'],
    }),
    getMyHires: build.query<IResponse<Hire>, IRequest>({
      query: (req) => ({
        url: `/hires/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Hire'],
    }),
    getReceivedHires: build.query<IResponse<Hire>, IRequest>({
      query: (req) => ({
        url: `/hires/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Hire'],
    }),
    getAllHires: build.query<IResponse<Hire>, IRequest>({
      query: (req) => ({
        url: `/hires/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Hire'],
    }),
    selectHireThings: build.query<MdThing[], number>({
      query: (hireId) => ({
        url: `/hires/${hireId}/things`,
      }),
      providesTags: ['Hire'],
    }),
    continueHire: build.mutation<void, HireIdDto>({
      query: ({ hireId }) => ({
        url: `/hires/${hireId}/continue`,
        method: 'POST',
      }),
      invalidatesTags: ['Hire', 'Box', 'Payment', 'Card'],
    }),
    completeHire: build.mutation<void, HireIdDto>({
      query: ({ hireId }) => ({
        url: `/hires/${hireId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Hire'],
    }),
  }),
});

export const {
  useGetMainHiresQuery,
  useGetMyHiresQuery,
  useGetReceivedHiresQuery,
  useGetAllHiresQuery,
  useSelectHireThingsQuery,
  useContinueHireMutation,
  useCompleteHireMutation,
} = hiresApi;
