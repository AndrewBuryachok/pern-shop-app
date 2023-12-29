import { t } from 'i18next';
import { Timeline } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import { parseTime } from '../../common/utils';

type Props = IModal<Article>;

export default function ViewArticleLikesModal({ data: article }: Props) {
  return (
    <Timeline>
      {article.likes.map((like) => (
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
