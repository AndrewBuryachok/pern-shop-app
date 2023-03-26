import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainShops() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    shop: '',
    name: '',
  });

  const response = useGetMainShopsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  return (
    <ShopsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Shops'
    />
  );
}
