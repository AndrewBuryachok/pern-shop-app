import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Answer } from './answer.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteAnswerMutation } from './answers.api';
import { DeleteAnswerDto } from './answer.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<Answer>;

export default function DeleteAnswerModal({ data: answer }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      answerId: answer.id,
    },
  });

  const [deleteAnswer, { isLoading }] = useDeleteAnswerMutation();

  const handleSubmit = async (dto: DeleteAnswerDto) => {
    await deleteAnswer(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.answers')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...answer.user} />}
        iconWidth={48}
        value={answer.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={answer.text}
        autosize
        readOnly
      />
    </CustomForm>
  );
}

export const deleteAnswerAction = {
  open: (answer: Answer) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.answers'),
      children: <DeleteAnswerModal data={answer} />,
    }),
  disable: (answer: Answer) => {
    const user = getCurrentUser();
    return answer.user.id !== user?.id && isUserNotHasRole(Role.JUDGE);
  },
  color: Color.RED,
};
