import { useTranslation } from 'react-i18next';
import { ActionIcon, Anchor, Button, Group, Paper, Stack } from '@mantine/core';
import { IconHeart, IconMessage } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikeArticleMutation } from './articles.api';
import { LikeArticleDto } from './article.dto';
import {
  useAddSubscriberMutation,
  useRemoveSubscriberMutation,
  useSelectMySubscribersQuery,
} from '../subscribers/subscribers.api';
import { UpdateSubscriberDto } from '../subscribers/subscriber.dto';
import CustomsList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import SingleText from '../../common/components/SingleText';
import CustomImage from '../../common/components/CustomImage';
import CustomActions from '../../common/components/CustomActions';
import { viewArticleAction } from './ViewArticleModal';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';
import { openViewArticleCommentsModal } from './ViewArticleCommentsModal';
import { openCreateCommentModal } from '../comments/CreateCommentModal';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const { data: subscribers, ...subscribersResponse } =
    useSelectMySubscribersQuery(undefined, { skip: !user });

  const [likeArticle] = useLikeArticleMutation();

  const handleLikeSubmit = async (dto: LikeArticleDto) => {
    await likeArticle(dto);
  };

  const [addSubscriber] = useAddSubscriberMutation();

  const handleSubscribeSubmit = async (dto: UpdateSubscriberDto) => {
    await addSubscriber(dto);
  };

  const [removeSubscriber] = useRemoveSubscriberMutation();

  const handleUnsubscribeSubmit = async (dto: UpdateSubscriberDto) => {
    await removeSubscriber(dto);
  };

  return (
    <CustomsList {...props}>
      {props.data?.result
        .map((article) => ({
          ...article,
          subscribed: subscribers?.find(
            (subscriber) => subscriber.id === article.user.id,
          ),
          liked: article.likes.find((like) => like.user.id === user?.id),
        }))
        .map((article) => (
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
                <Button
                  color={article.subscribed ? 'gray' : 'violet'}
                  loading={subscribersResponse.isFetching}
                  loaderPosition='center'
                  onClick={() =>
                    article.subscribed
                      ? handleUnsubscribeSubmit({ userId: article.user.id })
                      : handleSubscribeSubmit({ userId: article.user.id })
                  }
                  disabled={!user}
                  compact
                >
                  {article.subscribed
                    ? t('actions.unsubscribe')
                    : t('actions.subscribe')}
                </Button>
                <ActionIcon
                  size={24}
                  variant={article.liked && 'filled'}
                  color={article.liked && 'violet'}
                  onClick={() => handleLikeSubmit({ articleId: article.id })}
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
