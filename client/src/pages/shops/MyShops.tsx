import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { createShopButton } from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyShops() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyShopsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createShopButton;

  const actions = [editShopAction];

  return (
    <ShopsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Shops'
      actions={actions}
    />
  );
}
