import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { useEditPlaintMutation } from './plaints.api';
import { EditPlaintDto } from './plaint.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color, MAX_TITLE_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function EditPlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      title: plaint.title,
    },
  });

  const [editPlaint, { isLoading }] = useEditPlaintMutation();

  const handleSubmit = async (dto: EditPlaintDto) => {
    await editPlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.plaints')}
      isChanged={!form.isDirty()}
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
      <TextInput
        label={t('columns.title')}
        placeholder={t('columns.title')}
        required
        maxLength={MAX_TITLE_LENGTH}
        {...form.getInputProps('title')}
      />
    </CustomForm>
  );
}

export const editPlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.plaints'),
      children: <EditPlaintModal data={plaint} />,
    }),
  disable: (plaint: Plaint) => !!plaint.completedAt,
  color: Color.YELLOW,
};
