import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetLikedArticlesQuery } from '../../features/articles/articles.api';
import ArticlesList from '../../features/articles/ArticlesList';
import { Role } from '../../common/constants';

export default function LikedArticles() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetLikedArticlesQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  return (
    <ArticlesList
      {...response}
      title={t('pages.liked') + ' ' + t('navbar.articles')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
