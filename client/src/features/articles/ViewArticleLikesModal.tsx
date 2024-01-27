import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleLikesQuery } from './articles.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Article>;

export default function ViewArticleLikesModal({ data: article }: Props) {
  const response = useSelectArticleLikesQuery(article.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewArticleLikesModal = (article: Article) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewArticleLikesModal data={article} />,
  });
