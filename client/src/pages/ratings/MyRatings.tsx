import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyRatingsQuery } from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';
import { createRatingButton } from '../../features/ratings/CreateRatingModal';
import { editRatingAction } from '../../features/ratings/EditRatingModal';
import { deleteRatingAction } from '../../features/ratings/DeleteRatingModal';
import { Role } from '../../common/constants';

export default function MyRatings() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetMyRatingsQuery({ page, search });

  const links = [
    { label: 'Polled', to: '../polled' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createRatingButton;

  const actions = [editRatingAction, deleteRatingAction];

  return (
    <RatingsTable
      {...response}
      title='My Ratings'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
