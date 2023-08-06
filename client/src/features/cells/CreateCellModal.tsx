import { useEffect } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateCellMutation } from './cells.api';
import { useSelectMyStoragesQuery } from '../storages/storages.api';
import { CreateCellDto } from './cell.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
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

  const { data: storages, ...storagesResponse } = useSelectMyStoragesQuery();

  const storage = storages?.find(
    (storage) => storage.id === +form.values.storage,
  );

  useEffect(
    () => form.setFieldValue('name', storage ? `#${storage.cells + 1}` : ''),
    [form.values.storage],
  );

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
      <Select
        label='Storage'
        placeholder='Storage'
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStorages(storages)}
        searchable
        required
        disabled={storagesResponse.isFetching}
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
