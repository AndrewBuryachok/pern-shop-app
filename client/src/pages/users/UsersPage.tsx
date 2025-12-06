import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllUsersQuery,
  useGetBannedUsersQuery,
  useGetMainUsersQuery,
} from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserBannedButton } from '../../features/users/AddUserBannedModal';
import { removeUserBannedAction } from '../../features/users/RemoveUserBannedModal';
import { editUserPasswordAction } from '../../features/users/EditUserPasswordModal';
import { addUserRoleAction } from '../../features/users/AddUserRoleModal';
import { removeUserRoleAction } from '../../features/users/RemoveUserRoleModal';

export default function UsersPage() {
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
    main: useGetMainUsersQuery,
    banned: useGetBannedUsersQuery,
    all: useGetAllUsersQuery,
  }[tab]!(search);

  const button = { banned: addUserBannedButton }[tab];

  const actions = {
    banned: [removeUserBannedAction],
    all: [editUserPasswordAction, addUserRoleAction, removeUserRoleAction],
  }[tab];

  return (
    <UsersTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
