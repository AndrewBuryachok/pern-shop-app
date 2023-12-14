import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Vote } from './vote.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Vote>;

export default function ViewVoteModal({ data: vote }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={vote.id} disabled />
      <TextInput
        label={t('columns.voter')}
        icon={<CustomAvatar {...vote.user} />}
        iconWidth={48}
        value={vote.user.name}
        disabled
      />
      <TextInput
        label={t('columns.poller')}
        icon={<CustomAvatar {...vote.poll.user} />}
        iconWidth={48}
        value={vote.poll.user.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={vote.poll.description}
        disabled
      />
      <TextInput
        label={t('columns.vote')}
        value={vote.type ? t('columns.up') : t('columns.down')}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(vote.createdAt)}
        disabled
      />
    </Stack>
  );
}

export const viewVoteAction = {
  open: (vote: Vote) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.vote'),
      children: <ViewVoteModal data={vote} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
