import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();

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
          ? t('errors.not_enough_balance')
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
      text={t('actions.create') + ' ' + t('modals.order')}
    >
      <Select
        label={t('columns.storage')}
        placeholder={t('columns.storage')}
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        limit={20}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('storage')}
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
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
        max={customMin(MAX_PRICE_VALUE, myCard.balance - storage.price)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createOrderButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.order'),
      children: <CreateOrderModal />,
    }),
};
