import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';

export default function AllCards() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    name: '',
    cards: true,
  });

  const response = useGetAllCardsQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <CardsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Cards'
    />
  );
}
