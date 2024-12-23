import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { User } from '../users/user.model';
import { UserIdDto } from '../users/user.dto';
import { getQuery } from '../../common/utils';

export const residentsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyResidents: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/residents/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Resident'],
    }),
    deleteResident: build.mutation<void, UserIdDto>({
      query: ({ userId }) => ({
        url: `/residents/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resident'],
    }),
  }),
});

export const { useGetMyResidentsQuery, useDeleteResidentMutation } =
  residentsApi;
