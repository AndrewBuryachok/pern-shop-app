import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCreateVoteMutation } from '../votes/votes.api';
import { CreateVoteDto } from '../votes/vote.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Poll & { type: boolean }>;

export default function VotePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      type: poll.type,
    },
  });

  const [createVote, { isLoading }] = useCreateVoteMutation();

  const handleSubmit = async (dto: CreateVoteDto) => {
    await createVote(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.vote') + ' ' + t('modals.poll')}
    >
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
      <TextInput
        label={t('columns.vote')}
        value={poll.type ? t('columns.up') : t('columns.down')}
        disabled
      />
    </CustomForm>
  );
}

export const votePollFactory = (vote: boolean) => ({
  open: (poll: Poll) =>
    openModal({
      title: t('actions.vote') + ' ' + t('modals.poll'),
      children: <VotePollModal data={{ ...poll, type: vote }} />,
    }),
  disable: () => false,
  color: vote ? Color.GREEN : Color.RED,
});

export const createUpVoteAction = votePollFactory(true);

export const createDownVoteAction = votePollFactory(false);
