import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateCellMutation } from './cells.api';
import {
  useSelectAllStoragesQuery,
  useSelectMyStoragesQuery,
} from '../storages/storages.api';
import { CreateCellDto } from './cell.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectStorages } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateCellModal({ hasRole }: Props) {
  const [t] = useTranslation();

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

  const { data: storages, ...storagesResponse } = hasRole
    ? useSelectAllStoragesQuery()
    : useSelectMyStoragesQuery();

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
      text={t('actions.create') + ' ' + t('modals.cell')}
    >
      <Select
        label={t('columns.storage')}
        placeholder={t('columns.storage')}
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStorages(storages)}
        limit={20}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('storage')}
      />
      <TextInput
        label={t('columns.name')}
        disabled
        {...form.getInputProps('name')}
      />
    </CustomForm>
  );
}

export const createCellFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.cell'),
      children: <CreateCellModal hasRole={hasRole} />,
    }),
});

export const createMyCellButton = createCellFactory(false);

export const createUserCellButton = createCellFactory(false);
