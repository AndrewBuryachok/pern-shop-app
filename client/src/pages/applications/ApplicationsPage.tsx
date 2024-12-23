import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetReceivedApplicationsQuery,
  useGetSentApplicationsQuery,
} from '../../features/applications/applications.api';
import UsersTable from '../../features/users/UsersTable';
import TownsTable from '../../features/towns/TownsTable';
import { createApplicationButton } from '../../features/applications/CreateApplicationModal';
import { cancelApplicationAction } from '../../features/applications/CancelApplicationModal';
import { acceptApplicationAction } from '../../features/applications/AcceptApplicationModal';
import { rejectApplicationAction } from '../../features/applications/RejectApplicationModal';

export default function ResidentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search =
    tab === 'received'
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

  const townsResponse = useGetSentApplicationsQuery(search, {
    skip: tab !== 'sent',
  });

  const usersResponse = useGetReceivedApplicationsQuery(search, {
    skip: tab !== 'received',
  });

  return tab === 'received' ? (
    <UsersTable
      {...usersResponse}
      search={search}
      actions={[acceptApplicationAction, rejectApplicationAction]}
      column='time'
      callback={(user) => Math.floor(user.time! / 6) / 10}
    />
  ) : (
    <TownsTable
      {...townsResponse}
      search={search}
      button={createApplicationButton}
      actions={[cancelApplicationAction]}
    />
  );
}
