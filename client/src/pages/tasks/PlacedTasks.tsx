import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { Role } from '../../common/constants';

export default function PlacedTasks() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    city: searchParams.get('city'),
    description: searchParams.get('description') || '',
    priority: searchParams.get('priority'),
    status: searchParams.get('status'),
  });

  const response = useGetPlacedTasksQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.taken'), to: '../taken' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  return (
    <TasksTable
      {...response}
      title={t('pages.placed') + ' ' + t('navbar.tasks')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
