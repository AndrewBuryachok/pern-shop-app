import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const total = poll.upVotes + poll.downVotes;
  const votes = [poll.upVotes, poll.downVotes].map(
    (value) => `${value} (${total && Math.round((value * 100) / total)}%)`,
  );

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.poller')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={poll.description}
        disabled
      />
      <TextInput label={t('columns.up')} value={votes[0]} disabled />
      <TextInput label={t('columns.down')} value={votes[1]} disabled />
      <TextInput
        label={t('columns.my')}
        value={
          poll.myVote
            ? poll.myVote.type
              ? t('columns.up')
              : t('columns.down')
            : '-'
        }
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(poll.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(poll.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.poll'),
      children: <ViewPollModal data={poll} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
