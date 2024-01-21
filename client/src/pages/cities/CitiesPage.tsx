import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
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

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    city: searchParams.get('city'),
  });

  const response = {
    main: useGetMainCitiesQuery,
    my: useGetMyCitiesQuery,
    all: useGetAllCitiesQuery,
  }[tab]!({ page, search });

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
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
