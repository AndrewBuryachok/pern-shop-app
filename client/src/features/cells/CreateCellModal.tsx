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
import { useSelectStorageTagsQuery } from '../storages-tags/storages-tags.api';
import { CreateCellDto } from './cell.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectStorages, selectTags } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateCellModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storage: '',
      storageTag: '',
      name: '',
    },
    transformValues: ({ storageTag }) => ({ storageTagId: +storageTag }),
  });

  const { data: storages, ...storagesResponse } = hasRole
    ? useSelectAllStoragesQuery()
    : useSelectMyStoragesQuery();
  const { data: storagesTags, ...storagesTagsResponse } =
    useSelectStorageTagsQuery(+form.values.storage, {
      skip: !form.values.storage,
    });

  const storage = storages?.find(
    (storage) => storage.id === +form.values.storage,
  );

  useEffect(
    () => form.setFieldValue('name', storage ? `#${storage.cells + 1}` : '-'),
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
      text={t('actions.create') + ' ' + t('modals.cells')}
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
        readOnly={storagesResponse.isFetching}
        {...form.getInputProps('storage')}
      />
      <Select
        label={t('columns.tag')}
        placeholder={t('columns.tag')}
        rightSection={
          <RefetchAction
            {...storagesTagsResponse}
            skip={!form.values.storage}
          />
        }
        data={selectTags(storagesTags)}
        limit={20}
        searchable
        required
        readOnly={storagesTagsResponse.isFetching}
        {...form.getInputProps('storageTag')}
      />
      <TextInput
        label={t('columns.name')}
        readOnly
        {...form.getInputProps('name')}
      />
    </CustomForm>
  );
}

export const createCellFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.cells'),
      children: <CreateCellModal hasRole={hasRole} />,
    }),
});

export const createMyCellButton = createCellFactory(false);

export const createUserCellButton = createCellFactory(true);
