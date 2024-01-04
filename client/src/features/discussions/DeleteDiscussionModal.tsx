import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Discussion } from './discussion.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteDiscussionMutation } from './discussions.api';
import { DeleteDiscussionDto } from './discussion.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<Discussion>;

export default function DeleteDiscussionModal({ data: discussion }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      discussionId: discussion.id,
    },
  });

  const [deleteDiscussion, { isLoading }] = useDeleteDiscussionMutation();

  const handleSubmit = async (dto: DeleteDiscussionDto) => {
    await deleteDiscussion(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.discussions')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...discussion.user} />}
        iconWidth={48}
        value={discussion.user.nick}
        disabled
      />
      <Textarea label={t('columns.text')} value={discussion.text} disabled />
    </CustomForm>
  );
}

export const deleteDiscussionAction = {
  open: (discussion: Discussion) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.discussions'),
      children: <DeleteDiscussionModal data={discussion} />,
    }),
  disable: (discussion: Discussion) => {
    const user = getCurrentUser();
    return discussion.user.id !== user?.id && isUserNotHasRole(Role.ADMIN);
  },
  color: Color.RED,
};
