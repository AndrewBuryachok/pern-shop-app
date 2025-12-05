import { useLocation, useSearchParams } from 'react-router-dom';
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
import { completeShopAction } from '../../features/shops/CompleteShopModal';

export default function ShopsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    shop: searchParams.get('shop'),
  };

  const response = {
    main: useGetMainShopsQuery,
    my: useGetMyShopsQuery,
    all: useGetAllShopsQuery,
  }[tab]!(search);

  const button = {
    main: createMyShopButton,
    my: createMyShopButton,
    all: createUserShopButton,
  }[tab];

  const actions = {
    my: [editShopAction, completeShopAction],
    all: [editShopAction, completeShopAction],
  }[tab];

  return (
    <ShopsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
