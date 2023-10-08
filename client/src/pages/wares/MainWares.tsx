import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { buyWareAction } from '../../features/wares/BuyWareModal';
import { Role } from '../../common/constants';

export default function MainWares() {
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

  const response = useGetMainWaresQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [buyWareAction];

  return (
    <WaresTable
      {...response}
      title='Main Wares'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
