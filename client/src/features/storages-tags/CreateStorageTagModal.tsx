import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateStorageTagMutation } from './storages-tags.api';
import {
  useSelectAllStoragesQuery,
  useSelectMyStoragesQuery,
} from '../storages/storages.api';
import { CreateStorageTagDto } from './storage-tag.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectStorages } from '../../common/utils';
import {
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateStorageTagModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storage: '',
      name: '',
      price: 1,
    },
    transformValues: ({ storage, ...rest }) => ({
      ...rest,
      storageId: +storage,
    }),
  });

  const { data: storages, ...storagesResponse } = hasRole
    ? useSelectAllStoragesQuery()
    : useSelectMyStoragesQuery();

  const [createStorageTag, { isLoading }] = useCreateStorageTagMutation();

  const handleSubmit = async (dto: CreateStorageTagDto) => {
    await createStorageTag(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.tags')}
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

export const createStorageTagFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.tags'),
      children: <CreateStorageTagModal hasRole={hasRole} />,
    }),
});

export const createMyStorageTagButton = createStorageTagFactory(false);

export const createUserStorageTagButton = createStorageTagFactory(true);
