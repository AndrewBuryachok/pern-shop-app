import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useCreateMarketPurchaseMutation } from '../purchases/purchases.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { useSelectFreeStationsQuery } from '../stations/stations.api';
import { CreateMarketPurchaseDto } from '../purchases/purchase.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  customMin,
  parseCard,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  selectDeliveries,
  selectStationsWithPrice,
  selectUsers,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Ware> & { hasRole: boolean };

export default function BuyWareModal({ data: ware, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };
  const station = { price: 0 };

  const form = useForm({
    initialValues: {
      wareId: ware.id,
      user: '',
      card: '',
      amount: 1,
      delivery: '0',
      station: '',
      price: 0,
    },
    transformValues: ({ user, card, delivery, station, ...rest }) => ({
      ...rest,
      cardId: +card,
      stationId: +station,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance <
        values.amount * ware.price + station.price + values.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  useEffect(() => {
    form.setFieldValue('station', '');
    form.setFieldValue('price', +form.values.delivery);
  }, [form.values.delivery]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();
  const { data: stations, ...stationsResponse } = useSelectFreeStationsQuery(
    undefined,
    { skip: !+form.values.delivery },
  );

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  myCard.balance = card?.balance || 0;
  const maxAmount =
    card &&
    Math.floor((card.balance - station.price - form.values.price) / ware.price);
  station.price =
    stations?.find((station) => station.id === +form.values.station)?.price ||
    0;

  const [createMarketPurchase, { isLoading }] =
    useCreateMarketPurchaseMutation();

  const handleSubmit = async (dto: CreateMarketPurchaseDto) => {
    await createMarketPurchase(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.wares')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...ware} />}
        iconWidth={48}
        value={parseItem(ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(ware)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${ware.price} ${t('constants.currency')}`}
        readOnly
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
        description={`${t('information.decrease')} ${
          form.values.amount * ware.price + station.price + form.values.price
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
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={customMin(ware.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
      <Select
        label={t('columns.delivery')}
        placeholder={t('columns.delivery')}
        data={selectDeliveries()}
        searchable
        required
        {...form.getInputProps('delivery')}
      />
      {!!+form.values.delivery && (
        <>
          <Select
            label={t('columns.station')}
            placeholder={t('columns.station')}
            rightSection={<RefetchAction {...stationsResponse} />}
            itemComponent={PlacesItem}
            data={selectStationsWithPrice(stations)}
            limit={20}
            searchable
            required
            readOnly={stationsResponse.isFetching}
            {...form.getInputProps('station')}
          />
          <NumberInput
            label={t('columns.price')}
            placeholder={t('columns.price')}
            required
            min={1}
            max={customMin(
              MAX_PRICE_VALUE,
              (card?.balance || 0) -
                form.values.amount * ware.price -
                station.price,
            )}
            {...form.getInputProps('price')}
          />
        </>
      )}
    </CustomForm>
  );
}

export const buyWareFactory = (hasRole: boolean) => ({
  open: (ware: Ware) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.wares'),
      children: <BuyWareModal data={ware} hasRole={hasRole} />,
    }),
  disable: (ware: Ware) => !ware.amount,
  color: Color.GREEN,
});

export const buyMyWareAction = buyWareFactory(false);

export const buyUserWareAction = buyWareFactory(true);
