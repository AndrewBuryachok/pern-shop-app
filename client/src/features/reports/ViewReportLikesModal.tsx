import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import {
  useSelectReportDownLikesQuery,
  useSelectReportUpLikesQuery,
} from './reports.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Report> & { type: boolean };

export default function ViewReportLikesModal({ data: report, type }: Props) {
  const response = (
    type ? useSelectReportUpLikesQuery : useSelectReportDownLikesQuery
  )(report.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewReportLikesModal = (report: Report, type: boolean) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewReportLikesModal data={report} type={type} />,
  });
