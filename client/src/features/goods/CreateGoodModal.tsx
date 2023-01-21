import { NativeSelect, NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateGoodMutation } from './goods.api';
import { useSelectMyShopsQuery } from '../shops/shops.api';
import { CreateGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
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

  const { data: shops } = useSelectMyShopsQuery();

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
      <NativeSelect
        label='Shop'
        data={selectShops(shops)}
        required
        {...form.getInputProps('shop')}
      />
      <NativeSelect
        label='Category'
        data={selectCategories()}
        required
        {...form.getInputProps('category')}
      />
      <NativeSelect
        label='Item'
        data={selectItems().filter(
          (item) => item.category === form.values.category || !item.value,
        )}
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
      <NativeSelect
        label='Kit'
        data={selectKits()}
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
