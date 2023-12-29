import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { useCompletePlaintMutation } from './plaints.api';
import { UpdatePlaintDto } from './plaint.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function CompletePlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      text: '',
    },
  });

  const [completePlaint, { isLoading }] = useCompletePlaintMutation();

  const handleSubmit = async (dto: UpdatePlaintDto) => {
    await completePlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.plaints')}
    >
      <TextInput label={t('columns.title')} value={plaint.title} disabled />
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...plaint.senderUser} />}
        iconWidth={48}
        value={plaint.senderUser.nick}
        disabled
      />
      <Textarea label={t('columns.text')} value={plaint.senderText} disabled />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...plaint.receiverUser} />}
        iconWidth={48}
        value={plaint.receiverUser.nick}
        disabled
      />
      <Textarea
        label={t('columns.text')}
        value={plaint.receiverText}
        disabled
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const completePlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.plaints'),
      children: <CompletePlaintModal data={plaint} />,
    }),
  disable: (plaint: Plaint) => !!plaint.completedAt,
  color: Color.GREEN,
};
