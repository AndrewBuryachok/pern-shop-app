import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetReceivedInvitationsQuery,
  useGetSentInvitationsQuery,
} from '../../features/invitations/invitations.api';
import UsersTable from '../../features/users/UsersTable';
import TownsTable from '../../features/towns/TownsTable';
import { createInvitationButton } from '../../features/invitations/CreateInvitationModal';
import { cancelInvitationAction } from '../../features/invitations/CancelInvitationModal';
import { acceptInvitationAction } from '../../features/invitations/AcceptInvitationModal';
import { rejectInvitationAction } from '../../features/invitations/RejectInvitationModal';

export default function ResidentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search =
    tab === 'sent'
      ? {
          page: +(searchParams.get('page') || 1),
          id: +(searchParams.get('id') || 0) || null,
          user: searchParams.get('user'),
          roles: searchParams.get('roles')?.split(',') || [],
          town: searchParams.get('town'),
          type: searchParams.get('type'),
          minDate: searchParams.get('minDate'),
          maxDate: searchParams.get('maxDate'),
        }
      : {
          page: +(searchParams.get('page') || 1),
          id: +(searchParams.get('id') || 0) || null,
          user: searchParams.get('user'),
          town: searchParams.get('town'),
        };

  const usersResponse = useGetSentInvitationsQuery(search, {
    skip: tab !== 'sent',
  });

  const townsResponse = useGetReceivedInvitationsQuery(search, {
    skip: tab !== 'received',
  });

  return tab === 'sent' ? (
    <UsersTable
      {...usersResponse}
      search={search}
      button={createInvitationButton}
      actions={[cancelInvitationAction]}
      column='time'
      callback={(user) => Math.floor(user.time! / 6) / 10}
    />
  ) : (
    <TownsTable
      {...townsResponse}
      search={search}
      actions={[acceptInvitationAction, rejectInvitationAction]}
    />
  );
}
