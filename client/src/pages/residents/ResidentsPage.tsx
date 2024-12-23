import { useLocation, useSearchParams } from 'react-router-dom';
import { useGetMyResidentsQuery } from '../../features/residents/residents.api';
import UsersTable from '../../features/users/UsersTable';
import { deleteResidentAction } from '../../features/residents/DeleteResidentModal';

export default function ResidentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    town: searchParams.get('town'),
    type: searchParams.get('type'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    my: useGetMyResidentsQuery,
  }[tab]!(search);

  const actions = {
    my: [deleteResidentAction],
  }[tab];

  return (
    <UsersTable
      {...response}
      search={search}
      actions={actions}
      column='time'
      callback={(user) => Math.floor(user.time! / 6) / 10}
    />
  );
}
