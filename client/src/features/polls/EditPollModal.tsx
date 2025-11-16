import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditPollMutation } from './polls.api';
import { EditPollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole, selectMarks } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<Poll>;

export default function EditPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      text: poll.text,
      mark: `${poll.mark}`,
      images: poll.images,
    },
    transformValues: ({ mark, ...rest }) => ({ ...rest, mark: +mark }),
  });

  const [editPoll, { isLoading }] = useEditPollMutation();

  const handleSubmit = async (dto: EditPollDto) => {
    await editPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.polls')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Select
        label={t('columns.mark')}
        placeholder={t('columns.mark')}
        data={selectMarks()}
        searchable
        required
        {...form.getInputProps('mark')}
      />
    </CustomForm>
  );
}

export const editPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.polls'),
      children: <EditPollModal data={poll} />,
    }),
  disable: (poll: Poll) => {
    const user = getCurrentUser();
    return (
      (isUserNotHasRole(Role.INSPECTOR) && poll.user.id !== user?.id) ||
      !!poll.completedAt
    );
  },
  color: Color.YELLOW,
};
