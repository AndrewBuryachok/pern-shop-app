import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import { createCardButton } from '../../features/cards/CreateCardModal';
import { editCardAction } from '../../features/cards/EditCardModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyCards() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyCardsQuery({ page, search: debounced });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.BANKER) },
  ];

  const button = createCardButton;

  const actions = [editCardAction];

  return (
    <CardsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Cards'
      actions={actions}
    />
  );
}
