import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Answer } from './answer.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditAnswerMutation } from './answers.api';
import { EditAnswerDto } from './answer.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<Answer>;

export default function EditAnswerModal({ data: answer }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      answerId: answer.id,
      text: answer.text,
    },
  });

  const [editAnswer, { isLoading }] = useEditAnswerMutation();

  const handleSubmit = async (dto: EditAnswerDto) => {
    await editAnswer(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.answers')}
      isChanged={!form.isDirty()}
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
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const editAnswerAction = {
  open: (answer: Answer) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.answers'),
      children: <EditAnswerModal data={answer} />,
    }),
  disable: (answer: Answer) => {
    const user = getCurrentUser();
    return answer.user.id !== user?.id && isUserNotHasRole(Role.JUDGE);
  },
  color: Color.YELLOW,
};
