import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import { createCardButton } from '../../features/cards/CreateCardModal';
import { editCardAction } from '../../features/cards/EditCardModal';
import { addCardUserAction } from '../../features/cards/AddCardUserModal';
import { removeCardUserAction } from '../../features/cards/RemoveCardUserModal';
import { Role } from '../../common/constants';

export default function MyCards() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    name: '',
    cards: true,
  });

  const response = useGetMyCardsQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.BANKER }];

  const button = createCardButton;

  const actions = [editCardAction, addCardUserAction, removeCardUserAction];

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
