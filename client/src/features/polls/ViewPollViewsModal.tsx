import { useTranslation } from 'react-i18next';
import { Tabs } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollViewsQuery, useSelectPollVotesQuery } from './polls.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Poll>;

export default function ViewPollViewsModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const tabs = [
    {
      label: 'views',
      children: <ViewsTimeline {...useSelectPollViewsQuery(poll.id)} />,
    },
    {
      label: 'votes',
      children: <ReactionsTimeline {...useSelectPollVotesQuery(poll.id)} />,
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

export const openViewPollViewsModal = (poll: Poll) =>
  openModal({
    children: <ViewPollViewsModal data={poll} />,
  });
