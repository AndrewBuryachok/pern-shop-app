import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';

export default function AllWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Seller', 'Owner'].map((label, index) => ({
      label,
      value: !!index,
    })),
    item: '',
    description: '',
  });

  const response = useGetAllWaresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <WaresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Wares'
    />
  );
}
