import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageTag } from './storage-tag.model';
import { useEditStorageTagMutation } from './storages-tags.api';
import { EditStorageTagDto } from './storage-tag.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<StorageTag>;

export default function EditStorageTagModal({ data: storageTag }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storageTagId: storageTag.id,
      name: storageTag.name,
      price: storageTag.price,
    },
  });

  const [editStorageTag, { isLoading }] = useEditStorageTagMutation();

  const handleSubmit = async (dto: EditStorageTagDto) => {
    await editStorageTag(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.tags')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editStorageTagAction = {
  open: (storageTag: StorageTag) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.tags'),
      children: <EditStorageTagModal data={storageTag} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
