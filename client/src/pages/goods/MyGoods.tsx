import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import { createMyGoodButton } from '../../features/goods/CreateGoodModal';
import { editGoodAction } from '../../features/goods/EditGoodModal';
import { deleteGoodAction } from '../../features/goods/DeleteGoodModal';
import { Role } from '../../common/constants';

export default function MyGoods() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
  });

  const response = useGetMyGoodsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  const button = createMyGoodButton;

  const actions = [editGoodAction, deleteGoodAction];

  return (
    <GoodsTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.goods')}
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
