import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyRatingsQuery } from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';
import { createRatingButton } from '../../features/ratings/CreateRatingModal';
import { editRatingAction } from '../../features/ratings/EditRatingModal';
import { deleteRatingAction } from '../../features/ratings/DeleteRatingModal';
import { Role } from '../../common/constants';

export default function MyRatings() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    filters: [Filter.SENDER, Filter.RECEIVER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    rate: null,
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
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Ratings'
    />
  );
}
