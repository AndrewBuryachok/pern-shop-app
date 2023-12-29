import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCompletePollMutation } from './polls.api';
import { CompletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ColorsItem } from '../../common/components/ColorsItem';
import { selectResults } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function CompletePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      result: poll.result,
    },
  });

  const [completePoll, { isLoading }] = useCompletePollMutation();

  const handleSubmit = async (dto: CompletePollDto) => {
    await completePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.polls')}
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
        label={t('columns.result')}
        placeholder={t('columns.result')}
        itemComponent={ColorsItem}
        data={selectResults()}
        searchable
        required
        {...form.getInputProps('result')}
      />
    </CustomForm>
  );
}

export const completePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.polls'),
      children: <CompletePollModal data={poll} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
