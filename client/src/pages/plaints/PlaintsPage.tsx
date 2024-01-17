import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllPlaintsQuery,
  useGetMainPlaintsQuery,
  useGetMyPlaintsQuery,
  useGetReceivedPlaintsQuery,
} from '../../features/plaints/plaints.api';
import PlaintsTable from '../../features/plaints/PlaintsTable';
import {
  createMyPlaintButton,
  createUserPlaintButton,
} from '../../features/plaints/CreatePlaintModal';
import { executePlaintAction } from '../../features/plaints/ExecutePlaintModal';
import { completePlaintAction } from '../../features/plaints/CompletePlaintModal';
import { deletePlaintAction } from '../../features/plaints/DeletePlaintModal';

export default function MyPlaints() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER, Mode.EXECUTOR],
    mode: searchParams.get('mode') as Mode,
    title: searchParams.get('title') || '',
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainPlaintsQuery,
    my: useGetMyPlaintsQuery,
    received: useGetReceivedPlaintsQuery,
    all: useGetAllPlaintsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyPlaintButton,
    my: createMyPlaintButton,
    all: createUserPlaintButton,
  }[tab];

  const actions = {
    my: [deletePlaintAction],
    received: [executePlaintAction],
    all: [completePlaintAction],
  }[tab];

  return (
    <PlaintsTable
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
