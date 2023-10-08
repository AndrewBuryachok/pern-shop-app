import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import { createMyCardButton } from '../../features/cards/CreateCardModal';
import { editMyCardAction } from '../../features/cards/EditCardModal';
import { addMyCardUserAction } from '../../features/cards/AddCardUserModal';
import { removeMyCardUserAction } from '../../features/cards/RemoveCardUserModal';
import { Role } from '../../common/constants';

export default function MyCards() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    name: searchParams.get('name') || '',
    cards: true,
  });

  const response = useGetMyCardsQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.BANKER }];

  const button = createMyCardButton;

  const actions = [
    editMyCardAction,
    addMyCardUserAction,
    removeMyCardUserAction,
  ];

  return (
    <CardsTable
      {...response}
      title='My Cards'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
