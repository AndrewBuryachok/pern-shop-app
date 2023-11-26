import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateWareMutation } from './wares.api';
import {
  useSelectAllRentsQuery,
  useSelectMyRentsQuery,
} from '../rents/rents.api';
import { CreateWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  selectCategories,
  selectItems,
  selectKits,
  selectRents,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateWareModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      rent: '',
      category: '',
      item: '',
      description: '-',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ rent, item, kit, ...rest }) => ({
      ...rest,
      rentId: +rent,
      item: +item,
      kit: +kit,
    }),
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: rents, ...rentsResponse } = hasRole
    ? useSelectAllRentsQuery()
    : useSelectMyRentsQuery();

  const [createWare, { isLoading }] = useCreateWareMutation();

  const handleSubmit = async (dto: CreateWareDto) => {
    await createWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.ware')}
    >
      <Select
        label={t('columns.rent')}
        placeholder={t('columns.rent')}
        rightSection={<RefetchAction {...rentsResponse} />}
        itemComponent={PlacesItem}
        data={selectRents(rents)}
        limit={20}
        searchable
        required
        disabled={rentsResponse.isFetching}
        {...form.getInputProps('rent')}
      />
      <Select
        label={t('columns.category')}
        placeholder={t('columns.category')}
        data={selectCategories()}
        searchable
        required
        {...form.getInputProps('category')}
      />
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems(form.values.category)}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
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

export const createWareFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.ware'),
      children: <CreateWareModal hasRole={hasRole} />,
    }),
});

export const createMyWareButton = createWareFactory(false);

export const createUserWareButton = createWareFactory(true);
