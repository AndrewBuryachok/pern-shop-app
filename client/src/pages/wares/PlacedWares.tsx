import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { Role } from '../../common/constants';

export default function PlacedWares() {
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

  const response = useGetPlacedWaresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <WaresTable
      {...response}
      title='Placed Wares'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
