import { useTranslation } from 'react-i18next';
import { Tabs } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import {
  useSelectArticleLikesQuery,
  useSelectArticleViewsQuery,
} from './articles.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Article>;

export default function ViewArticleViewsModal({ data: article }: Props) {
  const [t] = useTranslation();

  const tabs = [
    {
      label: 'views',
      children: <ViewsTimeline {...useSelectArticleViewsQuery(article.id)} />,
    },
    {
      label: 'likes',
      children: (
        <ReactionsTimeline {...useSelectArticleLikesQuery(article.id)} />
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

export const openViewArticleViewsModal = (article: Article) =>
  openModal({
    children: <ViewArticleViewsModal data={article} />,
  });
