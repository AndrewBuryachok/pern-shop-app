import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';

export default function AllCards() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllCardsQuery({ page, search: debounced });

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
