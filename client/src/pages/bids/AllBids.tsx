import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllBidsQuery } from '../../features/bids/bids.api';
import BidsTable from '../../features/bids/BidsTable';

export default function AllBids() {
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

  const response = useGetAllBidsQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  return (
    <BidsTable
      {...response}
      title='All Bids'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
