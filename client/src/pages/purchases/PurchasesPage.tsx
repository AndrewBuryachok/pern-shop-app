import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllPurchasesQuery,
  useGetMyPurchasesQuery,
  useGetPlacedPurchasesQuery,
  useGetSoldPurchasesQuery,
} from '../../features/purchases/purchases.api';
import PurchasesTable from '../../features/purchases/PurchasesTable';
import { ratePurchaseAction } from '../../features/purchases/RatePurchaseModal';
import { deletePurchaseAction } from '../../features/purchases/DeletePurchaseModal';

export default function PurchasesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    shop: searchParams.get('shop'),
    market: searchParams.get('market'),
    stall: searchParams.get('stall'),
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    my: useGetMyPurchasesQuery,
    sold: useGetSoldPurchasesQuery,
    placed: useGetPlacedPurchasesQuery,
    all: useGetAllPurchasesQuery,
  }[tab]!(search);

  const actions = {
    my: [ratePurchaseAction],
    all: [ratePurchaseAction, deletePurchaseAction],
  }[tab];

  return <PurchasesTable {...response} search={search} actions={actions} />;
}
