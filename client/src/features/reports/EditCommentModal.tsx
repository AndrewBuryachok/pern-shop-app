import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ReportComment } from './comment.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditReportCommentMutation } from './comments.api';
import { EditCommentDto } from './comment.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<ReportComment>;

export default function EditCommentModal({ data: comment }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      commentId: comment.id,
      text: comment.text,
    },
  });

  const [editComment, { isLoading }] = useEditReportCommentMutation();

  const handleSubmit = async (dto: EditCommentDto) => {
    await editComment(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.comments')}
      isChanged={!form.isDirty()}
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
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const editCommentAction = {
  open: (comment: ReportComment) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.comments'),
      children: <EditCommentModal data={comment} />,
    }),
  disable: (comment: ReportComment) => {
    const user = getCurrentUser();
    return isUserNotHasRole(Role.INSPECTOR) && comment.user.id !== user?.id;
  },
  color: Color.YELLOW,
};
