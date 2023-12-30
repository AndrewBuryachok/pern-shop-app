import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllShopsQuery,
  useGetMainShopsQuery,
  useGetMyShopsQuery,
} from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import {
  createMyShopButton,
  createUserShopButton,
} from '../../features/shops/CreateShopModal';
import { editShopAction } from '../../features/shops/EditShopModal';

export default function MyShops() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
  });

  const response = {
    main: useGetMainShopsQuery,
    my: useGetMyShopsQuery,
    all: useGetAllShopsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyShopButton,
    my: createMyShopButton,
    all: createUserShopButton,
  }[tab];

  const actions = { my: [editShopAction], all: [editShopAction] }[tab];

  return (
    <ShopsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
