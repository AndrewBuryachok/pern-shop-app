import { useEffect } from 'react';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateDeliveryMutation } from './deliveries.api';
import { useSelectFreeStoragesQuery } from '../storages/storages.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateDeliveryDto } from './delivery.dto';
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

export default function CreateDeliveryModal() {
  const myCard = { balance: 0 };
  const fromStorage = { price: 0 };
  const toStorage = { price: 0 };

  const form = useForm({
    initialValues: {
      fromStorage: '',
      toStorage: '',
      card: '',
      category: '',
      item: '',
      description: '-',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({
      fromStorage,
      toStorage,
      card,
      item,
      kit,
      ...rest
    }) => ({
      ...rest,
      fromStorageId: +fromStorage,
      toStorageId: +toStorage,
      cardId: +card,
      item: +item,
      kit: +kit,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance < fromStorage.price + toStorage.price + values.price
          ? 'Not enough balance'
          : null,
    },
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: storages, ...storagesResponse } = useSelectFreeStoragesQuery();
  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  fromStorage.price =
    storages?.find((storage) => storage.id === +form.values.fromStorage)
      ?.price || 0;
  toStorage.price =
    storages?.find((storage) => storage.id === +form.values.toStorage)?.price ||
    0;
  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createDelivery, { isLoading }] = useCreateDeliveryMutation();

  const handleSubmit = async (dto: CreateDeliveryDto) => {
    await createDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create delivery'}
    >
      <Select
        label='From Storage'
        placeholder='From Storage'
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('fromStorage')}
      />
      <Select
        label='To Storage'
        placeholder='To Storage'
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('toStorage')}
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
        max={customMin(
          MAX_PRICE_VALUE,
          myCard.balance - fromStorage.price - toStorage.price,
        )}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createDeliveryButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Delivery',
      children: <CreateDeliveryModal />,
    }),
};
