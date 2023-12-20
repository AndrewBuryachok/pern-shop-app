import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { useDeletePlaintMutation } from './plaints.api';
import { DeletePlaintDto } from './plaint.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Plaint>;

export default function DeletePlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
    },
  });

  const [deletePlaint, { isLoading }] = useDeletePlaintMutation();

  const handleSubmit = async (dto: DeletePlaintDto) => {
    await deletePlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.plaint')}
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
    </CustomForm>
  );
}

export const deletePlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.plaint'),
      children: <DeletePlaintModal data={plaint} />,
    }),
  disable: (plaint: Plaint) => !!plaint.executedAt,
  color: Color.RED,
};
