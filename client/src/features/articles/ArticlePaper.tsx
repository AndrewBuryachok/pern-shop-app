import { useEffect } from 'react';
import { Button, Group, HoverCard, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import {
  IconEye,
  IconMessage,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikeArticleMutation, useViewArticleMutation } from './articles.api';
import { LikeArticleDto, ViewArticleDto } from './article.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomActions from '../../common/components/CustomActions';
import ViewArticleViewsMenu from './ViewArticleViewsMenu';
import ViewArticleLikesMenu from './ViewArticleLikesMenu';
import ViewArticleCommentsModal from './ViewArticleCommentsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewArticleAction } from './ViewArticleModal';
import { openViewArticleViewsModal } from './ViewArticleViewsModal';

type Props = {
  article: Article & {
    viewed: boolean;
    upLiked: boolean;
    downLiked: boolean;
  };
  isViewedLoading: boolean;
  isLikedLoading: boolean;
  actions: IAction<Article>[];
};

export default function ArticlePaper({ article, ...props }: Props) {
  const user = getCurrentUser();

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
    if (
      user &&
      !article.viewed &&
      !props.isViewedLoading &&
      entry?.isIntersecting
    ) {
      handleViewSubmit({ articleId: article.id });
    }
  }, [entry?.isIntersecting]);

  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <AvatarWithDateText {...article} />
          <CustomActions
            data={article}
            actions={[viewArticleAction, ...props.actions]}
          />
        </Group>
        <CustomHighlight text={article.text} />
        {article.image1 && <CustomImage image={article.image1} />}
        {article.image2 && <CustomImage image={article.image2} />}
        {article.image3 && <CustomImage image={article.image3} />}
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbUp size={16} />}
                  variant='light'
                  color={article.upLiked ? 'green' : 'gray'}
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
              </HoverCard.Target>
              {!!article.upLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewArticleLikesMenu data={article} type={true} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbDown size={16} />}
                  variant='light'
                  color={article.downLiked ? 'red' : 'gray'}
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
              </HoverCard.Target>
              {!!article.downLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewArticleLikesMenu data={article} type={false} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
            <Button
              leftIcon={<IconMessage size={16} />}
              variant='light'
              color='gray'
              compact
            >
              {article.comments}
            </Button>
          </Group>
          <HoverCard zIndex={100} offset={4} position='top-end' withArrow>
            <HoverCard.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color={article.viewed ? 'blue' : 'gray'}
                loading={props.isViewedLoading}
                onClick={() => openViewArticleViewsModal(article)}
                compact
              >
                {article.views}
              </Button>
            </HoverCard.Target>
            {!!article.views && (
              <HoverCard.Dropdown p={4}>
                <ViewArticleViewsMenu data={article} />
              </HoverCard.Dropdown>
            )}
          </HoverCard>
        </Group>
        <ViewArticleCommentsModal data={article} />
      </Stack>
    </Paper>
  );
}
