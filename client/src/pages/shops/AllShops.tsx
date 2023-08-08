import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { createUserShopButton } from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';

export default function AllShops() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    shop: null,
    name: '',
  });

  const response = useGetAllShopsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserShopButton;

  const actions = [editShopAction];

  return (
    <ShopsTable
      {...response}
      title='All Shops'
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
