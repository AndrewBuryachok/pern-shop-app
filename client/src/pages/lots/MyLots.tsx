import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyLotsQuery } from '../../features/lots/lots.api';
import LotsTable from '../../features/lots/LotsTable';
import { createMyLotButton } from '../../features/lots/CreateLotModal';
import { completeLotAction } from '../../features/lots/CompleteLotModal';
import { Role } from '../../common/constants';

export default function MyLots() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SELLER, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
  });

  const response = useGetMyLotsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMyLotButton;

  const actions = [completeLotAction];

  return (
    <LotsTable
      {...response}
      title='My Lots'
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
