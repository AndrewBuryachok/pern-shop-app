import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { useSelectReportAttitudesQuery } from './reports.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Report>;

export default function ViewReportAttitudesModal({ data: report }: Props) {
  const response = useSelectReportAttitudesQuery(report.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewReportAttitudesModal = (report: Report) =>
  openModal({
    title: t('columns.attitudes'),
    children: <ViewReportAttitudesModal data={report} />,
  });
