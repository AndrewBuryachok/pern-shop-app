import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { useSelectReportLikesQuery } from './reports.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Report>;

export default function ViewReportLikesModal({ data: report }: Props) {
  const response = useSelectReportLikesQuery(report.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewReportLikesModal = (report: Report) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewReportLikesModal data={report} />,
  });
