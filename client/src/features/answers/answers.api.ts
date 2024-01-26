import { emptyApi } from '../../app/empty.api';
import { CreateAnswerDto, DeleteAnswerDto, EditAnswerDto } from './answer.dto';

export const answersApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createAnswer: build.mutation<void, CreateAnswerDto>({
      query: (dto) => ({
        url: '/answers',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Answer'],
    }),
    editAnswer: build.mutation<void, EditAnswerDto>({
      query: ({ answerId, ...dto }) => ({
        url: `/answers/${answerId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Answer'],
    }),
    deleteAnswer: build.mutation<void, DeleteAnswerDto>({
      query: ({ answerId }) => ({
        url: `/answers/${answerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Answer'],
    }),
  }),
});

export const {
  useCreateAnswerMutation,
  useEditAnswerMutation,
  useDeleteAnswerMutation,
} = answersApi;
