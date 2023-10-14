import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyBidsQuery } from '../../features/bids/bids.api';
import BidsTable from '../../features/bids/BidsTable';
import { Role } from '../../common/constants';

export default function MyBids() {
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
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetMyBidsQuery({ page, search });

  const links = [
    { label: 'Selled', to: '../selled' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <BidsTable
      {...response}
      title='My Bids'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
