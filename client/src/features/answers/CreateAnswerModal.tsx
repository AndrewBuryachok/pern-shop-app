import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from '../plaints/plaint.model';
import { useCreateAnswerMutation } from './answers.api';
import { CreateAnswerDto } from './answer.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function CreateAnswerModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      text: '',
    },
  });

  const [createPlaint, { isLoading }] = useCreateAnswerMutation();

  const handleSubmit = async (dto: CreateAnswerDto) => {
    await createPlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.answers')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...plaint.senderUser} />}
        iconWidth={48}
        value={plaint.senderUser.nick}
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...plaint.receiverUser} />}
        iconWidth={48}
        value={plaint.receiverUser.nick}
        readOnly
      />
      <TextInput label={t('columns.title')} value={plaint.title} readOnly />
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

export const createAnswerAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.answer') + ' ' + t('modals.plaints'),
      children: <CreateAnswerModal data={plaint} />,
    }),
  disable: (plaint: Plaint) => !!plaint.completedAt,
  color: Color.GREEN,
};
