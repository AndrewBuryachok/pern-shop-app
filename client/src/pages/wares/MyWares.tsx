import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { createMyWareButton } from '../../features/wares/CreateWareModal';
import { editWareAction } from '../../features/wares/EditWareModal';
import { Role } from '../../common/constants';

export default function MyWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SELLER, Mode.OWNER],
    mode: null,
    market: null,
    store: null,
    item: null,
    description: '',
  });

  const response = useGetMyWaresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMyWareButton;

  const actions = [editWareAction];

  return (
    <WaresTable
      {...response}
      title='My Wares'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
