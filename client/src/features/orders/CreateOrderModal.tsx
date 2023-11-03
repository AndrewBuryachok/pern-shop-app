import { useEffect } from 'react';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateOrderMutation } from './orders.api';
import { useSelectFreeStoragesQuery } from '../storages/storages.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingItem';
import { CardsItem } from '../../common/components/CardsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  customMin,
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

export default function CreateOrderModal() {
  const storage = { price: 0 };
  const myCard = { balance: 0 };

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
    validate: {
      card: (_, values) =>
        myCard.balance < storage.price + values.price
          ? 'Not enough balance'
          : null,
    },
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: storages, ...storagesResponse } = useSelectFreeStoragesQuery();
  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  storage.price =
    storages?.find((storage) => storage.id === +form.values.storage)?.price ||
    0;
  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleSubmit = async (dto: CreateOrderDto) => {
    await createOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create order'}
    >
      <Select
        label='Storage'
        placeholder='Storage'
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('storage')}
      />
      <Select
        label='Card'
        placeholder='Card'
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
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
        max={customMin(MAX_PRICE_VALUE, myCard.balance - storage.price)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createOrderButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Order',
      children: <CreateOrderModal />,
    }),
};
