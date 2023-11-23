import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllBidsQuery } from '../../features/bids/bids.api';
import BidsTable from '../../features/bids/BidsTable';

export default function AllBids() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetAllBidsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.selled'), to: '../selled' },
    { label: t('pages.placed'), to: '../placed' },
  ];

  return (
    <BidsTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.bids')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
