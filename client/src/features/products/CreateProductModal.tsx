import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateProductMutation } from './products.api';
import { useSelectFreeStoragesQuery } from '../storages/storages.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateProductDto } from './product.dto';
import CustomForm from '../../common/components/CustomForm';
import { ThingsItem } from '../../common/components/ThingItem';
import {
  selectCardsWithBalance,
  selectCategories,
  selectItems,
  selectKits,
  selectStoragesWithPrice,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

export default function CreateProductModal() {
  const form = useForm({
    initialValues: {
      storage: '',
      card: '',
      category: '',
      item: '',
      description: '-',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ storage, card, item, kit, ...rest }) => ({
      ...rest,
      storageId: +storage,
      cardId: +card,
      item: +item,
      kit: +kit,
    }),
  });

  const { data: storages } = useSelectFreeStoragesQuery();
  const { data: cards } = useSelectMyCardsQuery();

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (dto: CreateProductDto) => {
    await createProduct(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create product'}
    >
      <Select
        label='Storage'
        placeholder='Storage'
        data={selectStoragesWithPrice(storages)}
        searchable
        required
        {...form.getInputProps('storage')}
      />
      <Select
        label='Card'
        placeholder='Card'
        data={selectCardsWithBalance(cards)}
        searchable
        required
        {...form.getInputProps('card')}
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

export const createProductButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Product',
      children: <CreateProductModal />,
    }),
};
