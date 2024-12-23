import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { User } from '../users/user.model';
import { Town } from '../towns/town.model';
import { UserIdDto } from '../users/user.dto';
import { TownIdDto } from '../towns/town.dto';
import { getQuery } from '../../common/utils';

export const invitationsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getSentInvitations: build.query<IResponse<User>, IRequest>({
      query: (req) => ({
        url: `/invitations/sent?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Invitation'],
    }),
    getReceivedInvitations: build.query<IResponse<Town>, IRequest>({
      query: (req) => ({
        url: `/invitations/received?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Invitation'],
    }),
    createInvitation: build.mutation<void, UserIdDto>({
      query: ({ userId }) => ({
        url: `/invitations/sent/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),
    cancelInvitation: build.mutation<void, UserIdDto>({
      query: ({ userId }) => ({
        url: `/invitations/sent/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invitation'],
    }),
    acceptInvitation: build.mutation<void, TownIdDto>({
      query: ({ townId }) => ({
        url: `/invitations/received/${townId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation', 'Resident'],
    }),
    rejectInvitation: build.mutation<void, TownIdDto>({
      query: ({ townId }) => ({
        url: `/invitations/received/${townId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invitation'],
    }),
  }),
});

export const {
  useGetSentInvitationsQuery,
  useGetReceivedInvitationsQuery,
  useCreateInvitationMutation,
  useCancelInvitationMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} = invitationsApi;
