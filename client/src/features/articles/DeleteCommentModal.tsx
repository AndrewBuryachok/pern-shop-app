import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ArticleComment } from './comment.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteArticleCommentMutation } from './comments.api';
import { DeleteCommentDto } from './comment.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<ArticleComment>;

export default function DeleteCommentModal({ data: comment }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      commentId: comment.id,
    },
  });

  const [deleteComment, { isLoading }] = useDeleteArticleCommentMutation();

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
  open: (comment: ArticleComment) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.comments'),
      children: <DeleteCommentModal data={comment} />,
    }),
  disable: (comment: ArticleComment) => {
    const user = getCurrentUser();
    return isUserNotHasRole(Role.MODER) && comment.user.id !== user?.id;
  },
  color: Color.RED,
};
