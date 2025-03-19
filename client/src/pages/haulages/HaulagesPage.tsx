import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllHaulagesQuery,
  useGetMainHaulagesQuery,
  useGetMyHaulagesQuery,
  useGetPlacedHaulagesQuery,
  useGetTakenHaulagesQuery,
} from '../../features/haulages/haulages.api';
import HaulagesTable from '../../features/haulages/HaulagesTable';
import {
  createMyHaulageButton,
  createUserHaulageButton,
} from '../../features/haulages/CreateHaulageModal';
import {
  editMyHaulageAction,
  editUserHaulageAction,
} from '../../features/haulages/EditHaulageModal';
import {
  takeMyHaulageAction,
  takeUserHaulageAction,
} from '../../features/haulages/TakeHaulageModal';
import { executeHaulageAction } from '../../features/haulages/ExecuteHaulageModal';
import { completeHaulageAction } from '../../features/haulages/CompleteHaulageModal';
import { untakeHaulageAction } from '../../features/haulages/UntakeHaulageModal';
import { deleteHaulageAction } from '../../features/haulages/DeleteHaulageModal';

export default function HaulagesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    station: searchParams.get('station'),
    box: searchParams.get('box'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainHaulagesQuery,
    my: useGetMyHaulagesQuery,
    taken: useGetTakenHaulagesQuery,
    placed: useGetPlacedHaulagesQuery,
    all: useGetAllHaulagesQuery,
  }[tab]!(search);

  const button = {
    main: createMyHaulageButton,
    my: createMyHaulageButton,
    all: createUserHaulageButton,
  }[tab];

  const actions = {
    main: [takeMyHaulageAction],
    my: [editMyHaulageAction, completeHaulageAction, deleteHaulageAction],
    taken: [executeHaulageAction, untakeHaulageAction],
    all: [
      editUserHaulageAction,
      takeUserHaulageAction,
      executeHaulageAction,
      completeHaulageAction,
      untakeHaulageAction,
      deleteHaulageAction,
    ],
  }[tab];

  return (
    <HaulagesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
