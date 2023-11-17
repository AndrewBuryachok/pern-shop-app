import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { createMyWareButton } from '../../features/wares/CreateWareModal';
import { editWareAction } from '../../features/wares/EditWareModal';
import { completeWareAction } from '../../features/wares/CompleteWareModal';
import { Role } from '../../common/constants';

export default function MyWares() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    item: searchParams.get('item'),
    description: '',
  });

  const response = useGetMyWaresQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.placed'), to: '../placed' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  const button = createMyWareButton;

  const actions = [editWareAction, completeWareAction];

  return (
    <WaresTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.wares')}
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
