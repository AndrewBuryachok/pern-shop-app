import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllCardsQuery } from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import { createUserCardButton } from '../../features/cards/CreateCardModal';
import { editUserCardAction } from '../../features/cards/EditCardModal';
import { addUserCardUserAction } from '../../features/cards/AddCardUserModal';
import { removeUserCardUserAction } from '../../features/cards/RemoveCardUserModal';

export default function AllCards() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
  });

  const response = useGetAllCardsQuery({ page, search });

  const links = [{ label: t('pages.my'), to: '../my' }];

  const button = createUserCardButton;

  const actions = [
    editUserCardAction,
    addUserCardUserAction,
    removeUserCardUserAction,
  ];

  return (
    <CardsTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.cards')}
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
