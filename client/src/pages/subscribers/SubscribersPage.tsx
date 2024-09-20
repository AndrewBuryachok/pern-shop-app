import { useLocation, useSearchParams } from 'react-router-dom';
import { useGetSubscribersUsersQuery } from '../../features/users/users.api';
import {
  useGetMySubscribersQuery,
  useGetReceivedSubscribersQuery,
} from '../../features/subscribers/subscribers.api';
import UsersTable from '../../features/users/UsersTable';
import { addSubscriberButton } from '../../features/subscribers/AddSubscriberModal';
import { removeSubscriberAction } from '../../features/subscribers/RemoveSubscriberModal';

export default function SubscribersPage() {
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
    top: useGetSubscribersUsersQuery,
    my: useGetMySubscribersQuery,
    received: useGetReceivedSubscribersQuery,
  }[tab]!(search);

  const button = {
    top: addSubscriberButton,
    my: addSubscriberButton,
    received: addSubscriberButton,
  }[tab];

  const actions = { my: [removeSubscriberAction] }[tab];

  return (
    <UsersTable
      {...response}
      search={search}
      button={button}
      actions={actions}
      column='subscribers'
      callback={(user) => user.subscribersCount!}
    />
  );
}
