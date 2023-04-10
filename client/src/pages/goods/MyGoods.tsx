import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import { createGoodButton } from '../../features/goods/CreateGoodModal';
import { editGoodAction } from '../../features/goods/EditGoodModal';
import { deleteGoodAction } from '../../features/goods/DeleteGoodModal';
import { Role } from '../../common/constants';

export default function MyGoods() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    shop: null,
    item: null,
    description: '',
  });

  const response = useGetMyGoodsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createGoodButton;

  const actions = [editGoodAction, deleteGoodAction];

  return (
    <GoodsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Goods'
      actions={actions}
    />
  );
}
