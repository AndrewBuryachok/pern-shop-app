import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateDeliveryMutation } from './deliveries.api';
import { useSelectFreeStoragesQuery } from '../storages/storages.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateDeliveryDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItem } from '../../common/components/ThingsItem';
import { CardsItem } from '../../common/components/CardsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  customMin,
  selectCardsWithBalance,
  selectCategories,
  selectItems,
  selectKits,
  selectStoragesWithPrice,
  selectUsers,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateDeliveryModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };
  const fromStorage = { price: 0 };
  const toStorage = { price: 0 };

  const form = useForm({
    initialValues: {
      fromStorage: '',
      toStorage: '',
      user: '',
      card: '',
      category: '',
      item: '',
      description: '',
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
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: storages, ...storagesResponse } = useSelectFreeStoragesQuery();
  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

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
      text={t('actions.create') + ' ' + t('modals.delivery')}
    >
      <Select
        label={t('columns.storage') + ' ' + t('columns.from')}
        placeholder={t('columns.storage') + ' ' + t('columns.from')}
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        limit={20}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('fromStorage')}
      />
      <Select
        label={t('columns.storage') + ' ' + t('columns.to')}
        placeholder={t('columns.storage') + ' ' + t('columns.to')}
        rightSection={<RefetchAction {...storagesResponse} />}
        itemComponent={PlacesItem}
        data={selectStoragesWithPrice(storages)}
        limit={20}
        searchable
        required
        disabled={storagesResponse.isFetching}
        {...form.getInputProps('toStorage')}
      />
      {hasRole && (
        <Select
          label={t('columns.user')}
          placeholder={t('columns.user')}
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          disabled={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
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
        allowDeselect
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
        max={customMin(
          MAX_PRICE_VALUE,
          myCard.balance - fromStorage.price - toStorage.price,
        )}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createDeliveryFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.delivery'),
      children: <CreateDeliveryModal hasRole={hasRole} />,
    }),
});

export const createMyDeliveryButton = createDeliveryFactory(false);

export const createUserDeliveryButton = createDeliveryFactory(true);
