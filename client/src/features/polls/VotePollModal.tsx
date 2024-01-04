import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useVotePollMutation } from './polls.api';
import { VotePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ColorsItem } from '../../common/components/ColorsItem';
import { selectVoteTypes } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function VotePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      type: '',
    },
    transformValues: ({ type, ...rest }) => ({
      ...rest,
      type: !!+type,
    }),
  });

  const [votePoll, { isLoading }] = useVotePollMutation();

  const handleSubmit = async (dto: VotePollDto) => {
    await votePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.vote') + ' ' + t('modals.polls')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        disabled
      />
      <TextInput label={t('columns.title')} value={poll.title} disabled />
      <Textarea label={t('columns.text')} value={poll.text} disabled />
      <Select
        label={t('columns.type')}
        placeholder={t('columns.type')}
        itemComponent={ColorsItem}
        data={selectVoteTypes()}
        searchable
        required
        {...form.getInputProps('type')}
      />
    </CustomForm>
  );
}

export const votePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.vote') + ' ' + t('modals.polls'),
      children: <VotePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};
