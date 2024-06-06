import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllRentsQuery,
  useGetMainRentsQuery,
  useGetMyRentsQuery,
  useGetReceivedRentsQuery,
} from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';
import {
  continueMyRentAction,
  continueUserRentAction,
} from '../../features/rents/ContinueRentModal';
import { completeRentAction } from '../../features/rents/CompleteRentModal';

export default function RentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    main: useGetMainRentsQuery,
    my: useGetMyRentsQuery,
    received: useGetReceivedRentsQuery,
    all: useGetAllRentsQuery,
  }[tab]!(search);

  const actions = {
    my: [continueMyRentAction, completeRentAction],
    all: [continueUserRentAction, completeRentAction],
  }[tab];

  return <RentsTable {...response} search={search} actions={actions} />;
}
