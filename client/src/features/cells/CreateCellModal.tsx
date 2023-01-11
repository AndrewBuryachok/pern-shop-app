import { NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateCellMutation } from './cells.api';
import { useSelectMyStoragesQuery } from '../storages/storages.api';
import { CreateCellDto } from './cell.dto';
import CustomForm from '../../common/components/CustomForm';
import { selectStorages } from '../../common/utils';

export default function CreateCellModal() {
  const form = useForm({
    initialValues: {
      storage: '',
      name: '',
    },
    transformValues: ({ storage, ...rest }) => ({
      ...rest,
      storageId: +storage,
    }),
  });

  const { data: storages } = useSelectMyStoragesQuery();

  const storage = storages?.find(
    (storage) => storage.id === +form.values.storage,
  );
  form.values.name = storage ? `#${storage.cells + 1}` : '';

  const [createCell, { isLoading }] = useCreateCellMutation();

  const handleSubmit = async (dto: CreateCellDto) => {
    await createCell(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create cell'}
    >
      <NativeSelect
        label='Storage'
        data={selectStorages(storages)}
        required
        {...form.getInputProps('storage')}
      />
      <TextInput label='Name' disabled {...form.getInputProps('name')} />
    </CustomForm>
  );
}

export const createCellButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Cell',
      children: <CreateCellModal />,
    }),
};
