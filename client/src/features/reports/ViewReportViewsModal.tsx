import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { useSelectReportViewsQuery } from './reports.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';

type Props = IModal<Report>;

export default function ViewReportViewsModal({ data: report }: Props) {
  const response = useSelectReportViewsQuery(report.id);

  return <ViewsTimeline {...response} />;
}

export const openViewReportViewsModal = (report: Report) =>
  openModal({
    title: t('columns.views'),
    children: <ViewReportViewsModal data={report} />,
  });
