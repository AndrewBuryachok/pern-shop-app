import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainLotsQuery } from '../../features/lots/lots.api';
import LotsTable from '../../features/lots/LotsTable';
import { buyMyLotAction } from '../../features/lots/BuyLotModal';
import { Role } from '../../common/constants';

export default function MainLots() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = useGetMainLotsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.placed'), to: 'placed' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  const actions = [buyMyLotAction];

  return (
    <LotsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.lots')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
