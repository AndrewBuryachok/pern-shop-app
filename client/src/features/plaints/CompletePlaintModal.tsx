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
import { Color, MAX_DESCRIPTION_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function CompletePlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      description: '-',
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
      text={t('actions.complete') + ' ' + t('modals.plaint')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...plaint.senderUser} />}
        iconWidth={48}
        value={plaint.senderUser.nick}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={plaint.senderDescription}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...plaint.receiverUser} />}
        iconWidth={48}
        value={plaint.receiverUser.nick}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={plaint.senderDescription}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const completePlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.plaint'),
      children: <CompletePlaintModal data={plaint} />,
    }),
  disable: (plaint: Plaint) => !plaint.executedAt || !!plaint.completedAt,
  color: Color.GREEN,
};
