import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import { Role } from '../../common/constants';

export default function MainGoods() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
  });

  const response = useGetMainGoodsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  return (
    <GoodsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.goods')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
