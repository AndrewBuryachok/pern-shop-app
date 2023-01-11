import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import { createGoodButton } from '../../features/goods/CreateGoodModal';
import { deleteGoodAction } from '../../features/goods/DeleteGoodModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyGoods() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyGoodsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createGoodButton;

  const actions = [deleteGoodAction];

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
