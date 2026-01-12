import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateOrderMutation } from './orders.api';
import { useSelectAllStationsQuery } from '../stations/stations.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { ThingsItem } from '../../common/components/ThingsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  customMin,
  selectCardsWithBalance,
  selectItems,
  selectKits,
  selectStations,
  selectUsers,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_SUM_VALUE,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateOrderModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      station: '',
      user: '',
      card: '',
      item: '',
      description: '',
      amount: 1,
      intake: 1,
      kit: '',
      sum: 1,
    },
    transformValues: ({ station, user, card, kit, ...rest }) => ({
      ...rest,
      stationId: +station,
      cardId: +card,
      kit: +kit,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance < values.sum ? t('errors.not_enough_balance') : null,
    },
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: stations, ...stationsResponse } = useSelectAllStationsQuery();
  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleSubmit = async (dto: CreateOrderDto) => {
    const data = await createOrder(dto);
    if (!('error' in data) && !hasRole) {
      navigate('/orders/my');
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.orders')}
    >
      <Select
        label={t('columns.station')}
        placeholder={t('columns.station')}
        rightSection={<RefetchAction {...stationsResponse} />}
        itemComponent={PlacesItem}
        data={selectStations(stations)}
        limit={20}
        searchable
        required
        readOnly={stationsResponse.isFetching}
        {...form.getInputProps('station')}
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
        description={`${t('information.decrease')} ${form.values.sum} ${t(
          'constants.currency',
        )}`}
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        description={
          form.values.description &&
          form.values.description.length + '/' + MAX_DESCRIPTION_LENGTH
        }
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
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, myCard.balance)}
        {...form.getInputProps('sum')}
      />
    </CustomForm>
  );
}

export const createOrderFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.orders'),
      children: <CreateOrderModal hasRole={hasRole} />,
    }),
});

export const createMyOrderButton = createOrderFactory(false);

export const createUserOrderButton = createOrderFactory(true);
