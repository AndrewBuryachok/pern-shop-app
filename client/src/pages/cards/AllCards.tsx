import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import { createUserCardButton } from '../../features/cards/CreateCardModal';
import { editUserCardAction } from '../../features/cards/EditCardModal';
import { addUserCardUserAction } from '../../features/cards/AddCardUserModal';
import { removeUserCardUserAction } from '../../features/cards/RemoveCardUserModal';

export default function AllCards() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    name: '',
    cards: true,
  });

  const response = useGetAllCardsQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  const button = createUserCardButton;

  const actions = [
    editUserCardAction,
    addUserCardUserAction,
    removeUserCardUserAction,
  ];

  return (
    <CardsTable
      {...response}
      title='All Cards'
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
