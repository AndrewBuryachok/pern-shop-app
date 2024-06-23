import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import {
  useSelectArticleDownLikesQuery,
  useSelectArticleUpLikesQuery,
} from './articles.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Article> & { type: boolean };

export default function ViewArticleLikesModal({ data: article, type }: Props) {
  const response = (
    type ? useSelectArticleUpLikesQuery : useSelectArticleDownLikesQuery
  )(article.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewArticleLikesModal = (article: Article, type: boolean) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewArticleLikesModal data={article} type={type} />,
  });
