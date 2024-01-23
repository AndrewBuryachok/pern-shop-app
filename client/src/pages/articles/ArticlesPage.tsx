import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllArticlesQuery,
  useGetCommentedArticlesQuery,
  useGetLikedArticlesQuery,
  useGetMainArticlesQuery,
  useGetMyArticlesQuery,
  useGetSubscribedArticlesQuery,
} from '../../features/articles/articles.api';
import ArticlesList from '../../features/articles/ArticlesList';
import {
  createMyArticleButton,
  createUserArticleButton,
} from '../../features/articles/CreateArticleModal';
import { editArticleAction } from '../../features/articles/EditArticleModal';
import { deleteArticleAction } from '../../features/articles/DeleteArticleModal';

export default function ArticlesPage() {
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
    subscribed: useGetSubscribedArticlesQuery,
    liked: useGetLikedArticlesQuery,
    commented: useGetCommentedArticlesQuery,
    all: useGetAllArticlesQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyArticleButton,
    my: createMyArticleButton,
    all: createUserArticleButton,
  }[tab];

  const actions = {
    main: [editArticleAction, deleteArticleAction],
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
