import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';

export default function AllGoods() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    shop: null,
    item: null,
    description: '',
  });

  const response = useGetAllGoodsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <GoodsTable
      {...response}
      title='All Goods'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
