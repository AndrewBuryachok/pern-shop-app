import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetMySubscribersQuery,
  useGetReceivedSubscribersQuery,
} from '../../features/subscribers/subscribers.api';
import UsersTable from '../../features/users/UsersTable';
import { addSubscriberButton } from '../../features/subscribers/AddSubscriberModal';
import { removeSubscriberAction } from '../../features/subscribers/RemoveSubscriberModal';

export default function MySubscribers() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    city: searchParams.get('city'),
    type: searchParams.get('type'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMySubscribersQuery,
    received: useGetReceivedSubscribersQuery,
  }[tab]!({ page, search });

  const button = { my: addSubscriberButton }[tab];

  const actions = { my: [removeSubscriberAction] }[tab];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
