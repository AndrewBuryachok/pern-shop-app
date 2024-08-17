import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllAdvertsQuery,
  useGetMainAdvertsQuery,
  useGetMyAdvertsQuery,
} from '../../features/adverts/adverts.api';
import AdvertsTable from '../../features/adverts/AdvertsTable';
import {
  createMyAdvertButton,
  createUserAdvertButton,
} from '../../features/adverts/CreateAdvertModal';
import { editAdvertAction } from '../../features/adverts/EditAdvertModal';
import { deleteAdvertAction } from '../../features/adverts/DeleteAdvertModal';
import {
  respondMyAdvertAction,
  respondUserAdvertAction,
} from '../../features/adverts/RespondAdvertModal';

export default function AdvertsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    activity: searchParams.get('activity') || '',
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    main: useGetMainAdvertsQuery,
    my: useGetMyAdvertsQuery,
    all: useGetAllAdvertsQuery,
  }[tab]!(search);

  const button = {
    main: createMyAdvertButton,
    my: createMyAdvertButton,
    all: createUserAdvertButton,
  }[tab];

  const actions = {
    main: [respondMyAdvertAction],
    my: [editAdvertAction, deleteAdvertAction],
    all: [editAdvertAction, respondUserAdvertAction, deleteAdvertAction],
  }[tab];

  return (
    <AdvertsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
