import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollViewsQuery } from './polls.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewPollViewsModal } from './ViewPollViewsModal';

type Props = IModal<Poll>;

export default function ViewPollViewsMenu({ data: poll }: Props) {
  const { data: views, isFetching } = useSelectPollViewsQuery(poll.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {views?.slice(0, 4).map((view) => (
            <Tooltip key={view.id} label={view.user.nick} withArrow>
              <div>
                <LinkedAvatar {...view.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon size={32} onClick={() => openViewPollViewsModal(poll)}>
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
