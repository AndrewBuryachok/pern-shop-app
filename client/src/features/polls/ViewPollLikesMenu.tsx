import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollLikesQuery } from './polls.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewPollLikesModal } from './ViewPollLikesModal';

type Props = IModal<Poll> & { type: boolean };

export default function ViewPollLikesMenu({ data: poll, type }: Props) {
  const { data, isFetching } = useSelectPollLikesQuery(poll.id);

  const likes = data?.filter((like) => like.type === type);

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
          <ActionIcon size={32} onClick={() => openViewPollLikesModal(poll)}>
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
