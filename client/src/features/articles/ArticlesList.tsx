import { ActionIcon, Anchor, Group, Paper, Stack, Text } from '@mantine/core';
import { IconHeart } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomsList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomImage from '../../common/components/CustomImage';
import CustomActions from '../../common/components/CustomActions';
import { viewArticleAction } from './ViewArticleModal';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';
import { likeArticleAction } from './LikeArticleModal';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  return (
    <CustomsList {...props}>
      {props.data?.result.map((article) => (
        <Paper key={article.id} p='md' withBorder>
          <Stack spacing={8}>
            <Group spacing={0} position='apart'>
              <AvatarWithDateText {...article} />
              <CustomActions
                data={article}
                actions={[viewArticleAction, ...actions]}
              />
            </Group>
            <Text>{article.text}</Text>
            {article.image && <CustomImage {...article} />}
            <Group spacing={8}>
              <ActionIcon
                size={24}
                variant='light'
                color={
                  article.likes.find((like) => like.user.id === user?.id) &&
                  'violet'
                }
                onClick={() => likeArticleAction.open(article)}
                disabled={!user}
              >
                <IconHeart size={16} />
              </ActionIcon>
              <Anchor
                component='button'
                type='button'
                onClick={() => openViewArticleLikesModal(article)}
                color='dimmed'
              >
                {article.likes.length}
              </Anchor>
            </Group>
          </Stack>
        </Paper>
      ))}
    </CustomsList>
  );
}
