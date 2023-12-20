import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';

export default function AllTasks() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    city: searchParams.get('city'),
    title: searchParams.get('title') || '',
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    priority: searchParams.get('priority'),
    status: searchParams.get('status'),
  });

  const response = useGetAllTasksQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.taken'), to: '../taken' },
    { label: t('pages.placed'), to: '../placed' },
  ];

  return (
    <TasksTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.tasks')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
