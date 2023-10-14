import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllBidsQuery } from '../../features/bids/bids.api';
import BidsTable from '../../features/bids/BidsTable';

export default function AllBids() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: '',
    rate: +(+(searchParams.get('rate') || 0) || null || 0) || null,
  });

  const response = useGetAllBidsQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Selled', to: '../selled' },
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
