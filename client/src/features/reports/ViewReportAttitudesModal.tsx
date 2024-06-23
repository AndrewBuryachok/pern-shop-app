import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import {
  useSelectReportDownAttitudesQuery,
  useSelectReportUpAttitudesQuery,
} from './reports.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Report> & { type: boolean };

export default function ViewReportAttitudesModal({
  data: report,
  type,
}: Props) {
  const response = (
    type ? useSelectReportUpAttitudesQuery : useSelectReportDownAttitudesQuery
  )(report.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewReportAttitudesModal = (report: Report, type: boolean) =>
  openModal({
    title: t('columns.attitudes'),
    children: <ViewReportAttitudesModal data={report} type={type} />,
  });
