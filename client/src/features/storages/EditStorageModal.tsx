import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import { useEditStorageMutation } from './storages.api';
import { EditStorageDto } from './storage.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Storage>;

export default function EditStorageModal({ data: storage }: Props) {
  const form = useForm({
    initialValues: {
      storageId: storage.id,
      name: storage.name,
      x: storage.x,
      y: storage.y,
    },
  });

  const [editStorage, { isLoading }] = useEditStorageMutation();

  const handleSubmit = async (dto: EditStorageDto) => {
    await editStorage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit storage'}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <NumberInput
        label='X'
        placeholder='X'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label='Y'
        placeholder='Y'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
    </CustomForm>
  );
}

export const editStorageAction = {
  open: (storage: Storage) =>
    openModal({
      title: 'Edit Storage',
      children: <EditStorageModal data={storage} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
