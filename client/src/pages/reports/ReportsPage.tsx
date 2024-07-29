import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetEndReportsQuery,
  useGetEventsReportsQuery,
  useGetHubReportsQuery,
  useGetMainReportsQuery,
  useGetServerReportsQuery,
  useGetSiteReportsQuery,
  useGetSpawnReportsQuery,
} from '../../features/reports/reports.api';
import ReportsList from '../../features/reports/ReportsList';
import {
  createEndReportButton,
  createEventsReportButton,
  createHubReportButton,
  createServerReportButton,
  createSiteReportButton,
  createSpawnReportButton,
} from '../../features/reports/CreateReportModal';
import { editReportAction } from '../../features/reports/EditReportModal';
import { deleteReportAction } from '../../features/reports/DeleteReportModal';

export default function ReportsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    main: useGetMainReportsQuery,
    server: useGetServerReportsQuery,
    site: useGetSiteReportsQuery,
    events: useGetEventsReportsQuery,
    spawn: useGetSpawnReportsQuery,
    hub: useGetHubReportsQuery,
    end: useGetEndReportsQuery,
  }[tab]!(search);

  const button = {
    server: createServerReportButton,
    site: createSiteReportButton,
    events: createEventsReportButton,
    spawn: createSpawnReportButton,
    hub: createHubReportButton,
    end: createEndReportButton,
  }[tab];

  const actions = [editReportAction, deleteReportAction];

  return (
    <ReportsList
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
