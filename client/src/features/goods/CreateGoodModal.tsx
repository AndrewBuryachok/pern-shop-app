import { useEffect } from 'react';
import { Loader, NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateGoodMutation } from './goods.api';
import { useSelectMyShopsQuery } from '../shops/shops.api';
import { CreateGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  selectCategories,
  selectItems,
  selectKits,
  selectShops,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

export default function CreateGoodModal() {
  const form = useForm({
    initialValues: {
      shop: '',
      category: '',
      item: '',
      description: '-',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ shop, item, kit, ...rest }) => ({
      ...rest,
      shopId: +shop,
      item: +item,
      kit: +kit,
    }),
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: shops, isFetching: isShopsFetching } = useSelectMyShopsQuery();

  const [createGood, { isLoading }] = useCreateGoodMutation();

  const handleSubmit = async (dto: CreateGoodDto) => {
    await createGood(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create good'}
    >
      <Select
        label='Shop'
        placeholder='Shop'
        rightSection={isShopsFetching && <Loader size={16} />}
        itemComponent={PlacesItem}
        data={selectShops(shops)}
        searchable
        required
        disabled={isShopsFetching}
        {...form.getInputProps('shop')}
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

export const createGoodButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Good',
      children: <CreateGoodModal />,
    }),
};
