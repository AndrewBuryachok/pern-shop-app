import { t } from 'i18next';
import { Skeleton, Timeline } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleLikesQuery } from './articles.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import { parseTime } from '../../common/utils';

type Props = IModal<Article>;

export default function ViewArticleLikesModal({ data: article }: Props) {
  const { data: likes, ...likesResponse } = useSelectArticleLikesQuery(
    article.id,
  );

  return (
    <Timeline bulletSize={32}>
      {likesResponse.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {likes?.map((like) => (
        <Timeline.Item
          key={like.id}
          title={like.user.nick}
          bullet={<CustomAvatar {...like.user} />}
        >
          <SingleText text={parseTime(like.createdAt)} />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export const openViewArticleLikesModal = (article: Article) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewArticleLikesModal data={article} />,
  });
