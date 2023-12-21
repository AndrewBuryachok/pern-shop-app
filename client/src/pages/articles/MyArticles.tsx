import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyArticlesQuery } from '../../features/articles/articles.api';
import ArticlesList from '../../features/articles/ArticlesList';
import { createArticleButton } from '../../features/articles/CreateArticleModal';
import { editArticleAction } from '../../features/articles/EditArticleModal';
import { deleteArticleAction } from '../../features/articles/DeleteArticleModal';
import { Role } from '../../common/constants';

export default function MyArticles() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetMyArticlesQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.liked'), to: '../liked' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  const button = createArticleButton;

  const actions = [editArticleAction, deleteArticleAction];

  return (
    <ArticlesList
      {...response}
      title={t('pages.my') + ' ' + t('navbar.articles')}
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
