import { useEffect } from 'react';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateWareMutation } from './wares.api';
import { useSelectMyRentsQuery } from '../rents/rents.api';
import { CreateWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingItem';
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

export default function CreateWareModal() {
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

  const { data: rents } = useSelectMyRentsQuery();

  const [createWare, { isLoading }] = useCreateWareMutation();

  const handleSubmit = async (dto: CreateWareDto) => {
    await createWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create ware'}
    >
      <Select
        label='Rent'
        placeholder='Rent'
        data={selectRents(rents)}
        searchable
        required
        {...form.getInputProps('rent')}
      />
      <Select
        label='Category'
        placeholder='Category'
        data={selectCategories()}
        searchable
        required
        {...form.getInputProps('category')}
      />
      <Select
        label='Item'
        placeholder='Item'
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems(form.values.category)}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label='Amount'
        placeholder='Amount'
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label='Intake'
        placeholder='Intake'
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label='Kit'
        placeholder='Kit'
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
      />
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createWareButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Ware',
      children: <CreateWareModal />,
    }),
};
