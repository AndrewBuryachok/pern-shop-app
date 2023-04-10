import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainGoodsQuery } from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import { Role } from '../../common/constants';

export default function MainGoods() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    shop: null,
    item: null,
    description: '',
  });

  const response = useGetMainGoodsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  return (
    <GoodsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Goods'
    />
  );
}
