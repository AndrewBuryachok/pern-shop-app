import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllHiresQuery,
  useGetMainHiresQuery,
  useGetMyHiresQuery,
  useGetReceivedHiresQuery,
} from '../../features/hires/hires.api';
import HiresTable from '../../features/hires/HiresTable';
import {
  continueMyHireAction,
  continueUserHireAction,
} from '../../features/hires/ContinueHireModal';
import { completeHireAction } from '../../features/hires/CompleteHireModal';

export default function HiresPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.TENANT, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    station: searchParams.get('station'),
    drawer: searchParams.get('drawer'),
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainHiresQuery,
    my: useGetMyHiresQuery,
    received: useGetReceivedHiresQuery,
    all: useGetAllHiresQuery,
  }[tab]!(search);

  const actions = {
    my: [continueMyHireAction, completeHireAction],
    all: [continueUserHireAction, completeHireAction],
  }[tab];

  return <HiresTable {...response} search={search} actions={actions} />;
}
