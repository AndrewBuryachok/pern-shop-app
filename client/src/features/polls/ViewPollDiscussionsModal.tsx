import { t } from 'i18next';
import { Group, Skeleton, Timeline } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollDiscussionsQuery } from './polls.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { parseTime } from '../../common/utils';
import { editDiscussionAction } from '../discussions/EditDiscussionModal';
import { deleteDiscussionAction } from '../discussions/DeleteDiscussionModal';

type Props = IModal<Poll>;

export default function ViewPollDiscussionsModal({ data: poll }: Props) {
  const { data: discussions, ...discussionsResponse } =
    useSelectPollDiscussionsQuery(poll.id);

  return (
    <Timeline bulletSize={32}>
      {discussionsResponse.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {discussions?.map((discussion) => (
        <Timeline.Item
          key={discussion.id}
          title={discussion.user.nick}
          bullet={<CustomAvatar {...discussion.user} />}
        >
          <Group spacing={0} position='apart' align='flex-start' noWrap>
            <div>
              <SingleText text={discussion.text} />
              <SingleText text={parseTime(discussion.createdAt)} />
            </div>
            <CustomActions
              data={discussion}
              actions={[editDiscussionAction, deleteDiscussionAction]}
            />
          </Group>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export const openViewPollDiscussionsModal = (poll: Poll) =>
  openModal({
    title: t('columns.discussions'),
    children: <ViewPollDiscussionsModal data={poll} />,
  });
