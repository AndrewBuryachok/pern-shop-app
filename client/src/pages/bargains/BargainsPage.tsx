import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllBargainsQuery,
  useGetMyBargainsQuery,
  useGetSoldBargainsQuery,
} from '../../features/bargains/bargains.api';
import BargainsTable from '../../features/bargains/BargainsTable';
import { rateBargainAction } from '../../features/bargains/RateBargainModal';
import { deleteBargainAction } from '../../features/bargains/DeleteBargainModal';

export default function BargainsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER],
    mode: searchParams.get('mode') as Mode,
    shop: searchParams.get('shop'),
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
    my: useGetMyBargainsQuery,
    sold: useGetSoldBargainsQuery,
    all: useGetAllBargainsQuery,
  }[tab]!(search);

  const actions = {
    my: [rateBargainAction],
    all: [rateBargainAction, deleteBargainAction],
  }[tab];

  return <BargainsTable {...response} search={search} actions={actions} />;
}
