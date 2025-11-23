import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleLikesQuery } from './articles.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';

type Props = IModal<Article> & { type: boolean };

export default function ViewArticleLikesMenu({ data: article, type }: Props) {
  const { data, isFetching } = useSelectArticleLikesQuery(article.id);

  const likes = data?.filter((like) => like.type === type);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => <Skeleton key={key} w={32} h={32} />)
      ) : (
        <>
          {likes?.slice(0, 4).map((like) => (
            <Tooltip key={like.id} label={like.user.nick} withArrow>
              <div>
                <LinkedAvatar {...like.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewArticleLikesModal(article)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
