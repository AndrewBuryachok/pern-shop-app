import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleViewsQuery } from './articles.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';

type Props = IModal<Article>;

export default function ViewArticleViewsModal({ data: article }: Props) {
  const response = useSelectArticleViewsQuery(article.id);

  return <ViewsTimeline {...response} />;
}

export const openViewArticleViewsModal = (article: Article) =>
  openModal({
    title: t('columns.views'),
    children: <ViewArticleViewsModal data={article} />,
  });
