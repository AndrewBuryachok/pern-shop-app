import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleCommentsQuery } from './articles.api';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import { editCommentAction } from '../comments/EditCommentModal';
import { deleteCommentAction } from '../comments/DeleteCommentModal';

type Props = IModal<Article>;

export default function ViewArticleCommentsModal({ data: article }: Props) {
  const response = useSelectArticleCommentsQuery(article.id);

  return (
    <RepliesTimeline
      {...response}
      actions={[editCommentAction, deleteCommentAction]}
    />
  );
}

export const openViewArticleCommentsModal = (article: Article) =>
  openModal({
    title: t('columns.comments'),
    children: <ViewArticleCommentsModal data={article} />,
  });
