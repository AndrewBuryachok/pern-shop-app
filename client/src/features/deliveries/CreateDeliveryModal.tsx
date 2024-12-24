import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Radio, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMarketDeliveryMutation,
  useCreateShopDeliveryMutation,
  useCreateStorageDeliveryMutation,
} from './deliveries.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyBargainsQuery,
  useSelectUserBargainsQuery,
} from '../bargains/bargains.api';
import {
  useSelectMyTradesQuery,
  useSelectUserTradesQuery,
} from '../trades/trades.api';
import {
  useSelectMySalesQuery,
  useSelectUserSalesQuery,
} from '../sales/sales.api';
import { useSelectFreeStationsQuery } from '../stations/stations.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateAnyDeliveryDto } from './delivery.dto';
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
  selectBargains,
  selectCardsWithBalance,
  selectSales,
  selectStationsWithPrice,
  selectTrades,
  selectUsers,
} from '../../common/utils';
import { MAX_PRICE_VALUE } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateDeliveryModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const places = ['shop', 'market', 'storage'] as const;

  const [place, setPlace] = useState<(typeof places)[number]>(places[0]);

  const myCard = { balance: 0 };
  const station = { price: 0 };

  const form = useForm({
    initialValues: {
      user: '',
      bargain: '',
      trade: '',
      sale: '',
      station: '',
      card: '',
      price: 1,
    },
    transformValues: ({
      user,
      bargain,
      trade,
      sale,
      station,
      card,
      ...rest
    }) => ({
      ...rest,
      bargainId: +bargain,
      tradeId: +trade,
      saleId: +sale,
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
    form.setFieldValue('bargain', '');
    form.setFieldValue('trade', '');
    form.setFieldValue('sale', '');
    form.setFieldValue('card', '');
  }, [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: bargains, ...bargainsResponse } = hasRole
    ? useSelectUserBargainsQuery(+form.values.user, {
        skip: !form.values.user || place !== 'shop',
      })
    : useSelectMyBargainsQuery(undefined, { skip: place !== 'shop' });
  const { data: trades, ...tradesResponse } = hasRole
    ? useSelectUserTradesQuery(+form.values.user, {
        skip: !form.values.user || place !== 'market',
      })
    : useSelectMyTradesQuery(undefined, { skip: place !== 'market' });
  const { data: sales, ...salesResponse } = hasRole
    ? useSelectUserSalesQuery(+form.values.user, {
        skip: !form.values.user || place !== 'storage',
      })
    : useSelectMySalesQuery(undefined, { skip: place !== 'storage' });
  const { data: stations, ...stationsResponse } = useSelectFreeStationsQuery();
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);
  const bargain = bargains?.find(
    (bargain) => bargain.id === +form.values.bargain,
  );
  const trade = trades?.find((trade) => trade.id === +form.values.trade);
  const sale = sales?.find((sale) => sale.id === +form.values.sale);

  station.price =
    stations?.find((station) => station.id === +form.values.station)?.price ||
    0;
  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createShopDelivery, { isLoading: isShopLoading }] =
    useCreateShopDeliveryMutation();
  const [createMarketDelivery, { isLoading: isMarketLoading }] =
    useCreateMarketDeliveryMutation();
  const [createStorageDelivery, { isLoading: isStorageLoading }] =
    useCreateStorageDeliveryMutation();

  const handleSubmit = async (dto: CreateAnyDeliveryDto) => {
    switch (place) {
      case 'shop':
        await createShopDelivery(dto);
        break;
      case 'market':
        await createMarketDelivery(dto);
        break;
      case 'storage':
        await createStorageDelivery(dto);
        break;
      default:
        break;
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isShopLoading || isMarketLoading || isStorageLoading}
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
      <Radio.Group
        label={t('columns.place')}
        spacing='md'
        value={place}
        onChange={(value) => setPlace(value as (typeof places)[number])}
      >
        {places.map((place) => (
          <Radio key={place} label={t(`columns.${place}`)} value={place} />
        ))}
      </Radio.Group>
      {place === 'shop' && (
        <Select
          label={t('columns.bargain')}
          placeholder={t('columns.bargain')}
          icon={bargain && <ThingImage item={bargain.good.item} />}
          iconWidth={48}
          rightSection={
            <RefetchAction
              {...bargainsResponse}
              skip={!form.values.user && hasRole}
            />
          }
          itemComponent={ThingsItemWithAmount}
          data={selectBargains(bargains)}
          limit={20}
          searchable
          required
          readOnly={bargainsResponse.isFetching}
          {...form.getInputProps('bargain')}
        />
      )}
      {place === 'market' && (
        <Select
          label={t('columns.trade')}
          placeholder={t('columns.trade')}
          icon={trade && <ThingImage item={trade.ware.item} />}
          iconWidth={48}
          rightSection={
            <RefetchAction
              {...tradesResponse}
              skip={!form.values.user && hasRole}
            />
          }
          itemComponent={ThingsItemWithAmount}
          data={selectTrades(trades)}
          limit={20}
          searchable
          required
          readOnly={tradesResponse.isFetching}
          {...form.getInputProps('trade')}
        />
      )}
      {place === 'storage' && (
        <Select
          label={t('columns.sale')}
          placeholder={t('columns.sale')}
          icon={sale && <ThingImage item={sale.product.item} />}
          iconWidth={48}
          rightSection={
            <RefetchAction
              {...salesResponse}
              skip={!form.values.user && hasRole}
            />
          }
          itemComponent={ThingsItemWithAmount}
          data={selectSales(sales)}
          limit={20}
          searchable
          required
          readOnly={salesResponse.isFetching}
          {...form.getInputProps('sale')}
        />
      )}
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
