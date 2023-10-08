import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { createMyShopButton } from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';
import { Role } from '../../common/constants';

export default function MyShops() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
    name: searchParams.get('name') || '',
  });

  const response = useGetMyShopsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMyShopButton;

  const actions = [editShopAction];

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
