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
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikePollMutation, useViewPollMutation } from './polls.api';
import { LikePollDto, ViewPollDto } from './poll.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import MarkBadge from '../../common/components/MarkBadge';
import ResultBadge from '../../common/components/ResultBadge';
import CustomImage from '../../common/components/CustomImage';
import CustomActions from '../../common/components/CustomActions';
import ViewPollViewsMenu from './ViewPollViewsMenu';
import ViewPollLikesMenu from './ViewPollLikesMenu';
import ViewPollCommentsModal from './ViewPollCommentsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewPollAction } from './ViewPollModal';
import { openViewPollViewsModal } from './ViewPollViewsModal';

type Props = {
  poll: Poll & {
    viewed: boolean;
    upLiked: boolean;
    downLiked: boolean;
  };
  isViewedLoading: boolean;
  isLikedLoading: boolean;
  actions: IAction<Poll>[];
};

export default function PollPaper({ poll, ...props }: Props) {
  const user = getCurrentUser();

  const [viewPoll] = useViewPollMutation();

  const handleViewSubmit = async (dto: ViewPollDto) => {
    await viewPoll(dto);
  };

  const [likePoll] = useLikePollMutation();

  const handleLikeSubmit = async (dto: LikePollDto) => {
    await likePoll(dto);
  };

  const { ref, entry } = useIntersection();

  useEffect(() => {
    if (
      user &&
      !poll.viewed &&
      !props.isViewedLoading &&
      entry?.isIntersecting
    ) {
      handleViewSubmit({ pollId: poll.id });
    }
  }, [entry?.isIntersecting]);

  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <AvatarWithDateText {...poll} />
          <CustomActions
            data={poll}
            actions={[viewPollAction, ...props.actions]}
          />
        </Group>
        <CustomHighlight text={poll.text} />
        <Group spacing={8}>
          <MarkBadge {...poll} />
          <ResultBadge {...poll} />
        </Group>
        {poll.image && <CustomImage image={poll.image} />}
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbUp size={16} />}
                  variant='light'
                  color={poll.upLiked ? 'green' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ pollId: poll.id, type: true })
                      : openAuthModal()
                  }
                  compact
                >
                  {poll.upLikes}
                </Button>
              </HoverCard.Target>
              {!!poll.upLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewPollLikesMenu data={poll} type={true} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbDown size={16} />}
                  variant='light'
                  color={poll.downLiked ? 'red' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({ pollId: poll.id, type: false })
                      : openAuthModal()
                  }
                  compact
                >
                  {poll.downLikes}
                </Button>
              </HoverCard.Target>
              {!!poll.downLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewPollLikesMenu data={poll} type={false} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
            <Button
              leftIcon={<IconMessage size={16} />}
              variant='light'
              color='gray'
              compact
            >
              {poll.comments}
            </Button>
          </Group>
          <HoverCard zIndex={100} offset={4} position='top-end' withArrow>
            <HoverCard.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color={poll.viewed ? 'blue' : 'gray'}
                loading={props.isViewedLoading}
                onClick={() => openViewPollViewsModal(poll)}
                compact
              >
                {poll.views}
              </Button>
            </HoverCard.Target>
            {!!poll.views && (
              <HoverCard.Dropdown p={4}>
                <ViewPollViewsMenu data={poll} />
              </HoverCard.Dropdown>
            )}
          </HoverCard>
        </Group>
        <ViewPollCommentsModal data={poll} />
      </Stack>
    </Paper>
  );
}
