import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedBidsQuery } from '../../features/bids/bids.api';
import BidsTable from '../../features/bids/BidsTable';
import { Role } from '../../common/constants';

export default function PlacedBids() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
    rate: null,
  });

  const response = useGetPlacedBidsQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <BidsTable
      {...response}
      title='Placed Bids'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
