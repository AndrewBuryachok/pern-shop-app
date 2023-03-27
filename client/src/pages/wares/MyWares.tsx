import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { createWareButton } from '../../features/wares/CreateWareModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    mode: 'false',
    filters: ['Seller', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    market: null,
    store: null,
    item: null,
    description: '',
  });

  const response = useGetMyWaresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createWareButton;

  return (
    <WaresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Wares'
    />
  );
}
