import { ActionIcon, Anchor, Group, Paper, Stack } from '@mantine/core';
import { IconHeart, IconMessage } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomsList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import SingleText from '../../common/components/SingleText';
import CustomImage from '../../common/components/CustomImage';
import CustomActions from '../../common/components/CustomActions';
import { viewArticleAction } from './ViewArticleModal';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';
import { openLikeArticleModal } from './LikeArticleModal';
import { openViewArticleCommentsModal } from './ViewArticleCommentsModal';
import { openCreateCommentModal } from '../comments/CreateCommentModal';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  return (
    <CustomsList {...props}>
      {props.data?.result.map((article) => (
        <Paper key={article.id} p='md'>
          <Stack spacing={8}>
            <Group spacing={0} position='apart'>
              <AvatarWithDateText {...article} />
              <CustomActions
                data={article}
                actions={[viewArticleAction, ...actions]}
              />
            </Group>
            <SingleText text={article.text} />
            {article.image && <CustomImage {...article} />}
            <Group spacing={8}>
              <ActionIcon
                size={24}
                color={
                  article.likes.find((like) => like.user.id === user?.id) &&
                  'violet'
                }
                onClick={() => openLikeArticleModal(article)}
                disabled={!user}
              >
                <IconHeart size={16} />
              </ActionIcon>
              <Anchor
                component='button'
                type='button'
                onClick={() => openViewArticleLikesModal(article)}
                size='xs'
                color='dimmed'
                underline
              >
                {article.likes.length}
              </Anchor>
              <ActionIcon
                size={24}
                onClick={() => openCreateCommentModal(article)}
                disabled={!user}
              >
                <IconMessage size={16} />
              </ActionIcon>
              <Anchor
                component='button'
                type='button'
                onClick={() => openViewArticleCommentsModal(article)}
                size='xs'
                color='dimmed'
                underline
              >
                {article.comments.length}
              </Anchor>
            </Group>
          </Stack>
        </Paper>
      ))}
    </CustomsList>
  );
}
