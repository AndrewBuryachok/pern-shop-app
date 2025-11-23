import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useSelectArticleViewsQuery } from './articles.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewArticleViewsModal } from './ViewArticleViewsModal';

type Props = IModal<Article>;

export default function ViewArticleViewsMenu({ data: article }: Props) {
  const { data: views, isFetching } = useSelectArticleViewsQuery(article.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => <Skeleton key={key} w={32} h={32} />)
      ) : (
        <>
          {views?.slice(0, 4).map((view) => (
            <Tooltip key={view.id} label={view.user.nick} withArrow>
              <div>
                <LinkedAvatar {...view.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewArticleViewsModal(article)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
