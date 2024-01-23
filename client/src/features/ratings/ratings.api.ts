import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Rating } from './rating.model';
import {
  CreateRatingDto,
  DeleteRatingDto,
  EditRatingDto,
  ExtCreateRatingDto,
} from './rating.dto';
import { getQuery } from '../../common/utils';

export const ratingsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyRatings: build.query<IResponse<Rating>, IRequest>({
      query: (req) => ({
        url: `/ratings/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Rating'],
    }),
    getReceivedRatings: build.query<IResponse<Rating>, IRequest>({
      query: (req) => ({
        url: `/ratings/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Rating'],
    }),
    getAllRatings: build.query<IResponse<Rating>, IRequest>({
      query: (req) => ({
        url: `/ratings/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Rating'],
    }),
    createMyRating: build.mutation<void, CreateRatingDto>({
      query: (dto) => ({
        url: '/ratings',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Rating'],
    }),
    createUserRating: build.mutation<void, ExtCreateRatingDto>({
      query: (dto) => ({
        url: '/ratings/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Rating'],
    }),
    editRating: build.mutation<void, EditRatingDto>({
      query: ({ ratingId, ...dto }) => ({
        url: `/ratings/${ratingId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Rating'],
    }),
    deleteRating: build.mutation<void, DeleteRatingDto>({
      query: ({ ratingId }) => ({
        url: `/ratings/${ratingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rating'],
    }),
  }),
});

export const {
  useGetMyRatingsQuery,
  useGetReceivedRatingsQuery,
  useGetAllRatingsQuery,
  useCreateMyRatingMutation,
  useCreateUserRatingMutation,
  useEditRatingMutation,
  useDeleteRatingMutation,
} = ratingsApi;
