import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Discussion } from './discussion.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditDiscussionMutation } from './discussions.api';
import { EditDiscussionDto } from './discussion.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<Discussion>;

export default function EditDiscussionModal({ data: discussion }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      discussionId: discussion.id,
      text: discussion.text,
    },
  });

  const [editDiscussion, { isLoading }] = useEditDiscussionMutation();

  const handleSubmit = async (dto: EditDiscussionDto) => {
    await editDiscussion(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.discussions')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...discussion.user} />}
        iconWidth={48}
        value={discussion.user.nick}
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
    </CustomForm>
  );
}

export const editDiscussionAction = {
  open: (discussion: Discussion) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.discussions'),
      children: <EditDiscussionModal data={discussion} />,
    }),
  disable: (discussion: Discussion) => {
    const user = getCurrentUser();
    return discussion.user.id !== user?.id && isUserNotHasRole(Role.JUDGE);
  },
  color: Color.YELLOW,
};
