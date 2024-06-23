import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import {
  useSelectArticleDownLikesQuery,
  useSelectArticleUpLikesQuery,
} from './articles.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';

type Props = IModal<Article> & { type: boolean };

export default function ViewArticleLikesMenu({ data: article, type }: Props) {
  const { data: likes, isFetching } = (
    type ? useSelectArticleUpLikesQuery : useSelectArticleDownLikesQuery
  )(article.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {likes?.slice(0, 4).map((like) => (
            <Tooltip key={like.id} label={like.user.nick} withArrow>
              <div>
                <CustomAvatar {...like.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewArticleLikesModal(article, type)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
