import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateDeliveryMutation } from './deliveries.api';
import { useSelectFreeStationsQuery } from '../stations/stations.api';
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
  selectStationsWithPrice,
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
  const fromStation = { price: 0 };
  const toStation = { price: 0 };

  const form = useForm({
    initialValues: {
      fromStation: '',
      toStation: '',
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
      fromStation,
      toStation,
      card,
      item,
      kit,
      ...rest
    }) => ({
      ...rest,
      fromStationId: +fromStation,
      toStationId: +toStation,
      cardId: +card,
      item: +item,
      kit: +kit,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance < fromStation.price + toStation.price + values.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  const { data: stations, ...stationsResponse } = useSelectFreeStationsQuery();
  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  fromStation.price =
    stations?.find((station) => station.id === +form.values.fromStation)
      ?.price || 0;
  toStation.price =
    stations?.find((station) => station.id === +form.values.toStation)?.price ||
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
      text={t('actions.create') + ' ' + t('modals.deliveries')}
    >
      <Select
        label={t('columns.station') + ' ' + t('columns.from')}
        placeholder={t('columns.station') + ' ' + t('columns.from')}
        rightSection={<RefetchAction {...stationsResponse} />}
        itemComponent={PlacesItem}
        data={selectStationsWithPrice(stations)}
        limit={20}
        searchable
        required
        readOnly={stationsResponse.isFetching}
        {...form.getInputProps('fromStation')}
      />
      <Select
        label={t('columns.station') + ' ' + t('columns.to')}
        placeholder={t('columns.station') + ' ' + t('columns.to')}
        rightSection={<RefetchAction {...stationsResponse} />}
        itemComponent={PlacesItem}
        data={selectStationsWithPrice(stations)}
        limit={20}
        searchable
        required
        readOnly={stationsResponse.isFetching}
        {...form.getInputProps('toStation')}
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
          readOnly={usersResponse.isFetching}
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
        readOnly={cardsResponse.isFetching}
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
          myCard.balance - fromStation.price - toStation.price,
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
      title: t('actions.create') + ' ' + t('modals.deliveries'),
      children: <CreateDeliveryModal hasRole={hasRole} />,
    }),
});

export const createMyDeliveryButton = createDeliveryFactory(false);

export const createUserDeliveryButton = createDeliveryFactory(true);
