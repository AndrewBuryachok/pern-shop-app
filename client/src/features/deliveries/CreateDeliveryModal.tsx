import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateDeliveryMutation } from './deliveries.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyPurchasesQuery,
  useSelectUserPurchasesQuery,
} from '../purchases/purchases.api';
import { useSelectFreeStationsQuery } from '../stations/stations.api';
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
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { CardsItem } from '../../common/components/CardsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  customMin,
  selectCardsWithBalance,
  selectPurchases,
  selectStationsWithPrice,
  selectUsers,
} from '../../common/utils';
import { MAX_PRICE_VALUE } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateDeliveryModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };
  const station = { price: 0 };

  const form = useForm({
    initialValues: {
      user: '',
      purchase: '',
      station: '',
      card: '',
      price: 1,
    },
    transformValues: ({ user, purchase, station, card, ...rest }) => ({
      ...rest,
      purchaseId: +purchase,
      stationId: +station,
      cardId: +card,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance < station.price + values.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => {
    form.setFieldValue('purchase', '');
    form.setFieldValue('card', '');
  }, [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: purchases, ...purchasesResponse } = hasRole
    ? useSelectUserPurchasesQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyPurchasesQuery();
  const { data: stations, ...stationsResponse } = useSelectFreeStationsQuery();
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);
  const purchase = purchases?.find(
    (purchase) => purchase.id === +form.values.purchase,
  );

  station.price =
    stations?.find((station) => station.id === +form.values.station)?.price ||
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
        label={t('columns.purchase')}
        placeholder={t('columns.purchase')}
        icon={purchase && <ThingImage item={purchase.good.item} />}
        iconWidth={48}
        rightSection={
          <RefetchAction
            {...purchasesResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={ThingsItemWithAmount}
        data={selectPurchases(purchases)}
        limit={20}
        searchable
        required
        readOnly={purchasesResponse.isFetching}
        {...form.getInputProps('purchase')}
      />
      <Select
        label={t('columns.toStation')}
        placeholder={t('columns.toStation')}
        rightSection={<RefetchAction {...stationsResponse} />}
        itemComponent={PlacesItem}
        data={selectStationsWithPrice(stations)}
        limit={20}
        searchable
        required
        readOnly={stationsResponse.isFetching}
        {...form.getInputProps('station')}
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        description={`${t('information.decrease')} ${
          station.price + form.values.price
        } ${t('constants.currency')}`}
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
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={customMin(MAX_PRICE_VALUE, myCard.balance - station.price)}
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
