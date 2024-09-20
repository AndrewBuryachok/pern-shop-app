import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllTownsQuery,
  useGetMainTownsQuery,
  useGetMyTownsQuery,
} from '../../features/towns/towns.api';
import TownsTable from '../../features/towns/TownsTable';
import {
  createMyTownButton,
  createUserTownButton,
} from '../../features/towns/CreateTownModal';
import {
  editMyTownAction,
  editUserTownAction,
} from '../../features/towns/EditTownModal';
import {
  addMyTownUserAction,
  addUserTownUserAction,
} from '../../features/towns/AddTownUserModal';
import {
  removeMyTownUserAction,
  removeUserTownUserAction,
} from '../../features/towns/RemoveTownUserModal';

export default function TownsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    town: searchParams.get('town'),
  };

  const response = {
    main: useGetMainTownsQuery,
    my: useGetMyTownsQuery,
    all: useGetAllTownsQuery,
  }[tab]!(search);

  const button = {
    main: createMyTownButton,
    my: createMyTownButton,
    all: createUserTownButton,
  }[tab];

  const actions = {
    my: [editMyTownAction, addMyTownUserAction, removeMyTownUserAction],
    all: [editUserTownAction, addUserTownUserAction, removeUserTownUserAction],
  }[tab];

  return (
    <TownsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
