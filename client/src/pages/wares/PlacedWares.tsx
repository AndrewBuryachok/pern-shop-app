import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { Role } from '../../common/constants';

export default function PlacedWares() {
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
    description: searchParams.get('description') || '',
  });

  const response = useGetPlacedWaresQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  return (
    <WaresTable
      {...response}
      title={t('pages.placed') + ' ' + t('navbar.wares')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
