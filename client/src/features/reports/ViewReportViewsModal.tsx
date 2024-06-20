import { useTranslation } from 'react-i18next';
import { Tabs } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import {
  useSelectReportAttitudesQuery,
  useSelectReportViewsQuery,
} from './reports.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Report>;

export default function ViewReportViewsModal({ data: report }: Props) {
  const [t] = useTranslation();

  const tabs = [
    {
      label: 'views',
      children: <ViewsTimeline {...useSelectReportViewsQuery(report.id)} />,
    },
    {
      label: 'attitudes',
      children: (
        <ReactionsTimeline {...useSelectReportAttitudesQuery(report.id)} />
      ),
    },
  ];

  return (
    <Tabs defaultValue={tabs[0].label}>
      <Tabs.List grow>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.label} value={tab.label}>
            {t(`columns.${tab.label}`)}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.label} value={tab.label} mt={8}>
          {tab.children}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export const openViewReportViewsModal = (report: Report) =>
  openModal({
    children: <ViewReportViewsModal data={report} />,
  });
