import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { Answer } from '../answers/answer.model';
import {
  CompletePlaintDto,
  CreatePlaintDto,
  DeletePlaintDto,
  EditPlaintDto,
  ExtCreatePlaintDto,
} from './plaint.dto';
import { getQuery } from '../../common/utils';

export const plaintsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints?${getQuery(req)}`,
      }),
      providesTags: ['Plaint', 'Answer'],
    }),
    getMyPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint', 'Answer'],
    }),
    getReceivedPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint', 'Answer'],
    }),
    getAnsweredPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/answered?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint', 'Answer'],
    }),
    getAllPlaints: build.query<IResponse<Plaint>, IRequest>({
      query: (req) => ({
        url: `/plaints/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Plaint', 'Answer'],
    }),
    selectPlaintAnswers: build.query<Answer[], number>({
      query: (plaintId) => ({
        url: `/plaints/${plaintId}/answers`,
      }),
      providesTags: ['Answer'],
      async onQueryStarted(plaintId, { dispatch, queryFulfilled, getState }) {
        const { data: answers } = await queryFulfilled;
        const endpoints = plaintsApi.util.selectInvalidatedBy(getState(), [
          'Plaint',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainPlaints')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              plaintsApi.util.updateQueryData(
                'getMainPlaints',
                endpoint.originalArgs,
                (draft) => {
                  const plaint = draft.result.find(
                    (plaint) => plaint.id === plaintId,
                  );
                  if (plaint) {
                    if (answers.length) {
                      plaint.answer = answers[answers.length - 1];
                    } else {
                      plaint.answer = undefined;
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
      },
    }),
    createMyPlaint: build.mutation<void, CreatePlaintDto>({
      query: (dto) => ({
        url: '/plaints',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    createUserPlaint: build.mutation<void, ExtCreatePlaintDto>({
      query: (dto) => ({
        url: '/plaints/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    editPlaint: build.mutation<void, EditPlaintDto>({
      query: ({ plaintId, ...dto }) => ({
        url: `/plaints/${plaintId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    completePlaint: build.mutation<void, CompletePlaintDto>({
      query: ({ plaintId, ...dto }) => ({
        url: `/plaints/${plaintId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Plaint'],
    }),
    deletePlaint: build.mutation<void, DeletePlaintDto>({
      query: ({ plaintId }) => ({
        url: `/plaints/${plaintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plaint'],
    }),
  }),
});

export const {
  useGetMainPlaintsQuery,
  useGetMyPlaintsQuery,
  useGetReceivedPlaintsQuery,
  useGetAnsweredPlaintsQuery,
  useGetAllPlaintsQuery,
  useSelectPlaintAnswersQuery,
  useCreateMyPlaintMutation,
  useCreateUserPlaintMutation,
  useEditPlaintMutation,
  useCompletePlaintMutation,
  useDeletePlaintMutation,
} = plaintsApi;
