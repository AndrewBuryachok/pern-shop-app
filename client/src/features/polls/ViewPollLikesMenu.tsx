import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import {
  useSelectPollDownLikesQuery,
  useSelectPollUpLikesQuery,
} from './polls.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewPollLikesModal } from './ViewPollLikesModal';

type Props = IModal<Poll> & { type: boolean };

export default function ViewPollLikesMenu({ data: poll, type }: Props) {
  const { data: likes, isFetching } = (
    type ? useSelectPollUpLikesQuery : useSelectPollDownLikesQuery
  )(poll.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
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
            onClick={() => openViewPollLikesModal(poll, type)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
