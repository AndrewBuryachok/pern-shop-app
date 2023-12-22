import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllGoodsQuery,
  useGetMainGoodsQuery,
  useGetMyGoodsQuery,
} from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import {
  createMyGoodButton,
  createUserGoodButton,
} from '../../features/goods/CreateGoodModal';
import { editGoodAction } from '../../features/goods/EditGoodModal';
import { deleteGoodAction } from '../../features/goods/DeleteGoodModal';

export default function MyGoods() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainGoodsQuery,
    my: useGetMyGoodsQuery,
    all: useGetAllGoodsQuery,
  }[tab]!({ page, search });

  const button = { my: createMyGoodButton, all: createUserGoodButton }[tab];

  const actions = {
    my: [editGoodAction, deleteGoodAction],
    all: [editGoodAction, deleteGoodAction],
  }[tab];

  return (
    <GoodsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
