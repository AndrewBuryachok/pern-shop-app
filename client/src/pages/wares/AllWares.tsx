import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { createUserWareButton } from '../../features/wares/CreateWareModal';
import { editWareAction } from '../../features/wares/EditWareModal';

export default function AllWares() {
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

  const response = useGetAllWaresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  const button = createUserWareButton;

  const actions = [editWareAction];

  return (
    <WaresTable
      {...response}
      title='All Wares'
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
