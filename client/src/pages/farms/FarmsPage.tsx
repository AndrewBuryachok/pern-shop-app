import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllFarmsQuery,
  useGetMainFarmsQuery,
  useGetMyFarmsQuery,
} from '../../features/farms/farms.api';
import FarmsTable from '../../features/farms/FarmsTable';
import {
  createMyFarmButton,
  createUserFarmButton,
} from '../../features/farms/CreateFarmModal';
import {
  editMyFarmAction,
  editUserFarmAction,
} from '../../features/farms/EditFarmModal';
import {
  addMyFarmUserAction,
  addUserFarmUserAction,
} from '../../features/farms/AddFarmUserModal';
import {
  removeMyFarmUserAction,
  removeUserFarmUserAction,
} from '../../features/farms/RemoveFarmUserModal';

export default function FarmsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    farm: searchParams.get('farm'),
  };

  const response = {
    main: useGetMainFarmsQuery,
    my: useGetMyFarmsQuery,
    all: useGetAllFarmsQuery,
  }[tab]!(search);

  const button = {
    main: createMyFarmButton,
    my: createMyFarmButton,
    all: createUserFarmButton,
  }[tab];

  const actions = {
    my: [editMyFarmAction, addMyFarmUserAction, removeMyFarmUserAction],
    all: [editUserFarmAction, addUserFarmUserAction, removeUserFarmUserAction],
  }[tab];

  return (
    <FarmsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
