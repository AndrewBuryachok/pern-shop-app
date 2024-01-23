import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Group, Paper, Stack } from '@mantine/core';
import { IconMessage, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useLikeArticleMutation,
  useSelectLikedArticlesQuery,
} from './articles.api';
import { LikeArticleDto } from './article.dto';
import {
  useAddSubscriberMutation,
  useRemoveSubscriberMutation,
  useSelectMySubscribersQuery,
} from '../subscribers/subscribers.api';
import { UpdateSubscriberDto } from '../subscribers/subscriber.dto';
import CustomList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import SingleText from '../../common/components/SingleText';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
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

  const { data: likedArticles, ...likedArticlesResponse } =
    useSelectLikedArticlesQuery(undefined, { skip: !user });

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
    <CustomList {...props}>
      {props.data?.result
        .map((article) => ({
          ...article,
          subscribed: subscribers?.find(
            (subscriber) => subscriber.id === article.user.id,
          ),
          upLiked: likedArticles?.find(
            (likedArticle) =>
              likedArticle.id === article.id && likedArticle.like.type,
          ),
          downLiked: likedArticles?.find(
            (likedArticle) =>
              likedArticle.id === article.id && !likedArticle.like.type,
          ),
        }))
        .map((article) => (
          <Paper key={article.id} p='md'>
            <Stack spacing={8}>
              <Group spacing={0} position='apart'>
                <Group spacing={8}>
                  <AvatarWithDateText {...article} />
                  <Button
                    color={article.subscribed ? 'gray' : 'violet'}
                    loading={subscribersResponse.isLoading}
                    loaderPosition='center'
                    onClick={() =>
                      user
                        ? article.subscribed
                          ? handleUnsubscribeSubmit({ userId: article.user.id })
                          : handleSubscribeSubmit({ userId: article.user.id })
                        : openAuthModal()
                    }
                    compact
                  >
                    {article.subscribed
                      ? t('actions.unsubscribe')
                      : t('actions.subscribe')}
                  </Button>
                </Group>
                <CustomActions
                  data={article}
                  actions={[viewArticleAction, ...actions]}
                />
              </Group>
              <SingleText text={article.text} />
              {article.image1 && <CustomImage image={article.image1} />}
              {article.image2 && <CustomImage image={article.image2} />}
              {article.image3 && <CustomImage image={article.image3} />}
              {article.video && <CustomVideo video={article.video} />}
              <Group spacing={8}>
                <ActionIcon
                  size={24}
                  variant={article.upLiked && 'filled'}
                  color={article.upLiked && 'violet'}
                  loading={likedArticlesResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ articleId: article.id, type: true })
                      : openAuthModal()
                  }
                >
                  <IconThumbUp size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${article.upLikes}`}
                  onClick={() => openViewArticleLikesModal(article)}
                />
                <ActionIcon
                  size={24}
                  variant={article.downLiked && 'filled'}
                  color={article.downLiked && 'violet'}
                  loading={likedArticlesResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ articleId: article.id, type: false })
                      : openAuthModal()
                  }
                >
                  <IconThumbDown size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${article.downLikes}`}
                  onClick={() => openViewArticleLikesModal(article)}
                />
                <ActionIcon
                  size={24}
                  onClick={() =>
                    user ? openCreateCommentModal(article) : openAuthModal()
                  }
                >
                  <IconMessage size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${article.comments}`}
                  onClick={() => openViewArticleCommentsModal(article)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}
    </CustomList>
  );
}
