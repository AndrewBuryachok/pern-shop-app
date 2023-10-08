import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { createUserShopButton } from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';

export default function AllShops() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
    name: searchParams.get('name') || '',
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
