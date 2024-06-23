import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Menu, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconEye, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikeArticleMutation, useViewArticleMutation } from './articles.api';
import { LikeArticleDto, ViewArticleDto } from './article.dto';
import {
  useAddSubscriberMutation,
  useRemoveSubscriberMutation,
} from '../subscribers/subscribers.api';
import { UpdateSubscriberDto } from '../subscribers/subscriber.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomActions from '../../common/components/CustomActions';
import ViewArticleViewsMenu from './ViewArticleViewsMenu';
import ViewArticleLikesMenu from './ViewArticleLikesMenu';
import ViewArticleCommentsModal from './ViewArticleCommentsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewArticleAction } from './ViewArticleModal';

type Props = {
  article: Article & {
    subscribed: boolean;
    viewed: boolean;
    upLiked: boolean;
    downLiked: boolean;
  };
  isSubscribersLoading: boolean;
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

  const [viewArticle] = useViewArticleMutation();

  const handleViewSubmit = async (dto: ViewArticleDto) => {
    await viewArticle(dto);
  };

  const [likeArticle] = useLikeArticleMutation();

  const handleLikeSubmit = async (dto: LikeArticleDto) => {
    await likeArticle({
      ...dto,
      upLiked: !!article.upLiked,
      downLiked: !!article.downLiked,
    });
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
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
                <Button
                  leftIcon={<IconThumbUp size={16} />}
                  variant={article.upLiked ? 'filled' : 'light'}
                  color={article.upLiked ? 'violet' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ articleId: article.id, type: true })
                      : openAuthModal()
                  }
                  compact
                >
                  {article.upLikes}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <ViewArticleLikesMenu data={article} type={true} />
              </Menu.Dropdown>
            </Menu>
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
                <Button
                  leftIcon={<IconThumbDown size={16} />}
                  variant={article.downLiked ? 'filled' : 'light'}
                  color={article.downLiked ? 'violet' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ articleId: article.id, type: false })
                      : openAuthModal()
                  }
                  compact
                >
                  {article.downLikes}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <ViewArticleLikesMenu data={article} type={false} />
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Menu
            zIndex={100}
            offset={4}
            position='top-end'
            trigger='hover'
            withArrow
          >
            <Menu.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color='gray'
                loading={props.isViewedLoading}
                compact
              >
                {article.views}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <ViewArticleViewsMenu data={article} />
            </Menu.Dropdown>
          </Menu>
        </Group>
        <ViewArticleCommentsModal data={article} />
      </Stack>
    </Paper>
  );
}
