import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { createShopButton } from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';
import { createGoodAction } from '../../features/goods/CreateGoodModal';
import { Role } from '../../common/constants';

export default function MyShops() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    shop: null,
    name: '',
  });

  const response = useGetMyShopsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createShopButton;

  const actions = [editShopAction, createGoodAction];

  return (
    <ShopsTable
      {...response}
      title='My Shops'
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
