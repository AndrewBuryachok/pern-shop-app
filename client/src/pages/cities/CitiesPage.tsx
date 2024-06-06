import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllCitiesQuery,
  useGetMainCitiesQuery,
  useGetMyCitiesQuery,
} from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import {
  createMyCityButton,
  createUserCityButton,
} from '../../features/cities/CreateCityModal';
import {
  editMyCityAction,
  editUserCityAction,
} from '../../features/cities/EditCityModal';
import {
  addMyCityUserAction,
  addUserCityUserAction,
} from '../../features/cities/AddCityUserModal';
import {
  removeMyCityUserAction,
  removeUserCityUserAction,
} from '../../features/cities/RemoveCityUserModal';

export default function CitiesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    city: searchParams.get('city'),
  };

  const response = {
    main: useGetMainCitiesQuery,
    my: useGetMyCitiesQuery,
    all: useGetAllCitiesQuery,
  }[tab]!(search);

  const button = {
    main: createMyCityButton,
    my: createMyCityButton,
    all: createUserCityButton,
  }[tab];

  const actions = {
    my: [editMyCityAction, addMyCityUserAction, removeMyCityUserAction],
    all: [editUserCityAction, addUserCityUserAction, removeUserCityUserAction],
  }[tab];

  return (
    <CitiesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
