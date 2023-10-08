import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainLotsQuery } from '../../features/lots/lots.api';
import LotsTable from '../../features/lots/LotsTable';
import { buyLotAction } from '../../features/lots/BuyLotModal';
import { Role } from '../../common/constants';

export default function MainLots() {
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

  const response = useGetMainLotsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [buyLotAction];

  return (
    <LotsTable
      {...response}
      title='Main Lots'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
