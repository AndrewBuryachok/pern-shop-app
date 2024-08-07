import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllLeasesQuery,
  useGetMainLeasesQuery,
  useGetMyLeasesQuery,
  useGetReceivedLeasesQuery,
} from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';
import {
  continueMyLeaseAction,
  continueUserLeaseAction,
} from '../../features/leases/ContinueLeaseModal';
import { completeLeaseAction } from '../../features/leases/CompleteLeaseModal';

export default function LeasesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    storageTag: searchParams.get('storageTag'),
    cell: searchParams.get('cell'),
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    main: useGetMainLeasesQuery,
    my: useGetMyLeasesQuery,
    received: useGetReceivedLeasesQuery,
    all: useGetAllLeasesQuery,
  }[tab]!(search);

  const actions = {
    my: [continueMyLeaseAction, completeLeaseAction],
    all: [continueUserLeaseAction, completeLeaseAction],
  }[tab];

  return <LeasesTable {...response} search={search} actions={actions} />;
}
