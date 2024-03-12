import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Group, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import {
  IconEye,
  IconMessage,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Article, SmArticle } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikeArticleMutation, useViewArticleMutation } from './articles.api';
import { LikeArticleDto, ViewArticleDto } from './article.dto';
import {
  useAddSubscriberMutation,
  useRemoveSubscriberMutation,
} from '../subscribers/subscribers.api';
import { useAddIgnorerMutation } from '../ignorers/ignorers.api';
import { UpdateSubscriberDto } from '../subscribers/subscriber.dto';
import { UpdateIgnorerDto } from '../ignorers/ignorer.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
import { viewArticleAction } from './ViewArticleModal';
import { openViewArticleViewsModal } from './ViewArticleViewsModal';
import { openViewArticleLikesModal } from './ViewArticleLikesModal';
import { openViewArticleCommentsModal } from './ViewArticleCommentsModal';

type Props = {
  article: Article & {
    subscribed: boolean;
    viewed: boolean;
    upLiked?: SmArticle;
    downLiked?: SmArticle;
  };
  isSubscribersLoading: boolean;
  isIgnorersLoading: boolean;
  isViewedLoading: boolean;
  isLikedLoading: boolean;
  actions: IAction<Article>[];
};

export default function ArticlePaper({ article, ...props }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const [addSubscriber] = useAddSubscriberMutation();

  const handleSubscribeSubmit = async (dto: UpdateSubscriberDto) => {
    await addSubscriber(dto);
  };

  const [removeSubscriber] = useRemoveSubscriberMutation();

  const handleUnsubscribeSubmit = async (dto: UpdateSubscriberDto) => {
    await removeSubscriber(dto);
  };

  const [addIgnorer] = useAddIgnorerMutation();

  const handleIgnoreSubmit = async (dto: UpdateIgnorerDto) => {
    await addIgnorer(dto);
  };

  const [viewArticle] = useViewArticleMutation();

  const handleViewSubmit = async (dto: ViewArticleDto) => {
    await viewArticle(dto);
  };

  const [likeArticle] = useLikeArticleMutation();

  const handleLikeSubmit = async (dto: LikeArticleDto) => {
    await likeArticle(dto);
  };

  const { ref, entry } = useIntersection();

  useEffect(() => {
    if (user && !article.viewed && entry?.isIntersecting) {
      handleViewSubmit({ articleId: article.id });
    }
  }, [entry?.isIntersecting]);

  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <AvatarWithDateText {...article} />
            <Button
              color={article.subscribed ? 'gray' : 'violet'}
              loading={props.isSubscribersLoading}
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
            <Button
              color='red'
              loading={props.isIgnorersLoading}
              loaderPosition='center'
              onClick={() =>
                user
                  ? handleIgnoreSubmit({ userId: article.user.id })
                  : openAuthModal()
              }
              compact
            >
              {t('actions.ignore')}
            </Button>
          </Group>
          <CustomActions
            data={article}
            actions={[viewArticleAction, ...props.actions]}
          />
        </Group>
        <CustomHighlight text={article.text} />
        {article.image1 && <CustomImage image={article.image1} />}
        {article.image2 && <CustomImage image={article.image2} />}
        {article.image3 && <CustomImage image={article.image3} />}
        {article.video && <CustomVideo video={article.video} />}
        <Group spacing={8}>
          <ActionIcon
            ref={ref}
            size={24}
            loading={props.isViewedLoading}
            onClick={() => openViewArticleViewsModal(article)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <CustomAnchor
            text={`${article.views}`}
            open={() => openViewArticleViewsModal(article)}
          />
          <ActionIcon
            size={24}
            variant={article.upLiked && 'filled'}
            color={article.upLiked && 'violet'}
            loading={props.isLikedLoading}
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
            open={() => openViewArticleLikesModal(article)}
          />
          <ActionIcon
            size={24}
            variant={article.downLiked && 'filled'}
            color={article.downLiked && 'violet'}
            loading={props.isLikedLoading}
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
            open={() => openViewArticleLikesModal(article)}
          />
          <ActionIcon
            size={24}
            onClick={() =>
              user ? openViewArticleCommentsModal(article) : openAuthModal()
            }
          >
            <IconMessage size={16} />
          </ActionIcon>
          <CustomAnchor
            text={`${article.comments}`}
            open={() => openViewArticleCommentsModal(article)}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
