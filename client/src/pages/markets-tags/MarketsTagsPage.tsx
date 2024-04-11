import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllMarketsTagsQuery,
  useGetMainMarketsTagsQuery,
  useGetMyMarketsTagsQuery,
} from '../../features/markets-tags/markets-tags.api';
import MarketsTagsTable from '../../features/markets-tags/MarketsTagsTable';
import {
  createMyMarketTagButton,
  createUserMarketTagButton,
} from '../../features/markets-tags/CreateMarketTagModal';
import { editMarketTagAction } from '../../features/markets-tags/EditMarketTagModal';

export default function MarketsTagsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    marketTag: searchParams.get('marketTag'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = {
    main: useGetMainMarketsTagsQuery,
    my: useGetMyMarketsTagsQuery,
    all: useGetAllMarketsTagsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyMarketTagButton,
    my: createMyMarketTagButton,
    all: createUserMarketTagButton,
  }[tab];

  const actions = { my: [editMarketTagAction], all: [editMarketTagAction] }[
    tab
  ];

  return (
    <MarketsTagsTable
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
