import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Comment } from './comment.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteCommentMutation } from './comments.api';
import { DeleteCommentDto } from './comment.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<Comment>;

export default function DeleteCommentModal({ data: comment }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      commentId: comment.id,
    },
  });

  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  const handleSubmit = async (dto: DeleteCommentDto) => {
    await deleteComment(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.comments')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...comment.user} />}
        iconWidth={48}
        value={comment.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={comment.text}
        autosize
        readOnly
      />
    </CustomForm>
  );
}

export const deleteCommentAction = {
  open: (comment: Comment) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.comments'),
      children: <DeleteCommentModal data={comment} />,
    }),
  disable: (comment: Comment) => {
    const user = getCurrentUser();
    return comment.user.id !== user?.id && isUserNotHasRole(Role.ADMIN);
  },
  color: Color.RED,
};
