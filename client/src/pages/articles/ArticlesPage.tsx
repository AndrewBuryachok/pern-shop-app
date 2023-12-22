import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllArticlesQuery,
  useGetLikedArticlesQuery,
  useGetMainArticlesQuery,
  useGetMyArticlesQuery,
} from '../../features/articles/articles.api';
import ArticlesList from '../../features/articles/ArticlesList';
import { createArticleButton } from '../../features/articles/CreateArticleModal';
import { editArticleAction } from '../../features/articles/EditArticleModal';
import { deleteArticleAction } from '../../features/articles/DeleteArticleModal';

export default function MyArticles() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainArticlesQuery,
    my: useGetMyArticlesQuery,
    liked: useGetLikedArticlesQuery,
    all: useGetAllArticlesQuery,
  }[tab]!({ page, search });

  const button = { my: createArticleButton }[tab];

  const actions = {
    my: [editArticleAction, deleteArticleAction],
    all: [editArticleAction, deleteArticleAction],
  }[tab];

  return (
    <ArticlesList
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
