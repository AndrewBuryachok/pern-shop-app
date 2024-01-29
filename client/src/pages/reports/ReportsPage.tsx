import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetHubReportsQuery,
  useGetMainReportsQuery,
  useGetServerReportsQuery,
  useGetSiteReportsQuery,
  useGetSpawnReportsQuery,
  useGetStatusReportsQuery,
} from '../../features/reports/reports.api';
import ReportsList from '../../features/reports/ReportsList';
import {
  createHubReportButton,
  createServerReportButton,
  createSiteReportButton,
  createSpawnReportButton,
  createStatusReportButton,
} from '../../features/reports/CreateReportModal';
import { editReportAction } from '../../features/reports/EditReportModal';
import { deleteReportAction } from '../../features/reports/DeleteReportModal';

export default function ReportsPage() {
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
    main: useGetMainReportsQuery,
    server: useGetServerReportsQuery,
    site: useGetSiteReportsQuery,
    status: useGetStatusReportsQuery,
    spawn: useGetSpawnReportsQuery,
    hub: useGetHubReportsQuery,
  }[tab]!({ page, search });

  const button = {
    server: createServerReportButton,
    site: createSiteReportButton,
    status: createStatusReportButton,
    spawn: createSpawnReportButton,
    hub: createHubReportButton,
  }[tab];

  const actions = [editReportAction, deleteReportAction];

  return (
    <ReportsList
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
