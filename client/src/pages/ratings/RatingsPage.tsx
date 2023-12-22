import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllRatingsQuery,
  useGetMyRatingsQuery,
  useGetReceivedRatingsQuery,
} from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';
import { createRatingButton } from '../../features/ratings/CreateRatingModal';
import { editRatingAction } from '../../features/ratings/EditRatingModal';
import { deleteRatingAction } from '../../features/ratings/DeleteRatingModal';

export default function MyRatings() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMyRatingsQuery,
    received: useGetReceivedRatingsQuery,
    all: useGetAllRatingsQuery,
  }[tab]!({ page, search });

  const button = { my: createRatingButton }[tab];

  const actions = { my: [editRatingAction, deleteRatingAction] }[tab];

  return (
    <RatingsTable
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
