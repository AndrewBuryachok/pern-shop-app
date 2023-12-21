import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parseTime, viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const myVote = user && poll.votes.find((vote) => vote.user.id === user.id);
  const upVotes = poll.votes
    .filter((vote) => vote.type)
    .map((vote) => vote.user);
  const downVotes = poll.votes
    .filter((vote) => !vote.type)
    .map((vote) => vote.user);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={poll.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        disabled
      />
      <TextInput label={t('columns.title')} value={poll.title} disabled />
      <Textarea label={t('columns.text')} value={poll.text} disabled />
      <TextInput
        label={t('columns.my')}
        value={
          myVote ? (myVote.type ? t('columns.up') : t('columns.down')) : '-'
        }
        disabled
      />
      <Select
        label={t('columns.up')}
        placeholder={`${t('components.total')}: ${upVotes.length}`}
        itemComponent={UsersItem}
        data={viewUsers(upVotes)}
        limit={20}
        searchable
      />
      <Select
        label={t('columns.down')}
        placeholder={`${t('components.total')}: ${downVotes.length}`}
        itemComponent={UsersItem}
        data={viewUsers(downVotes)}
        limit={20}
        searchable
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
