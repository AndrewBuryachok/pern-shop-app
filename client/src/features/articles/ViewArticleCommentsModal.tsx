import { t } from 'i18next';
import { Group, Skeleton, Timeline } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleCommentsQuery } from './articles.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { parseTime } from '../../common/utils';
import { editCommentAction } from '../comments/EditCommentModal';
import { deleteCommentAction } from '../comments/DeleteCommentModal';

type Props = IModal<Article>;

export default function ViewArticleCommentsModal({ data: article }: Props) {
  const { data: comments, ...commentsResponse } = useSelectArticleCommentsQuery(
    article.id,
  );

  return (
    <Timeline bulletSize={32}>
      {commentsResponse.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {comments?.map((comment) => (
        <Timeline.Item
          key={comment.id}
          title={comment.user.nick}
          bullet={<CustomAvatar {...comment.user} />}
        >
          <Group spacing={0} position='apart' align='flex-start' noWrap>
            <div>
              <SingleText text={comment.text} />
              <SingleText text={parseTime(comment.createdAt)} />
            </div>
            <CustomActions
              data={comment}
              actions={[editCommentAction, deleteCommentAction]}
            />
          </Group>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export const openViewArticleCommentsModal = (article: Article) =>
  openModal({
    title: t('columns.comments'),
    children: <ViewArticleCommentsModal data={article} />,
  });
