import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CloseButton,
  Group,
  Input,
  NumberInput,
  Rating,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useCreatePurchaseMutation } from '../purchases/purchases.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { useSelectAllStationsQuery } from '../stations/stations.api';
import { CreatePurchaseDto } from '../purchases/purchase.dto';
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
  selectStations,
  selectUsers,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Good> & { hasRole: boolean };

export default function BuyGoodModal({ data: good, hasRole }: Props) {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      goodId: good.id,
      user: '',
      card: '',
      amount: 1,
      rate: 0,
      delivery: '0',
      station: '',
      sum: 0,
    },
    transformValues: ({ user, card, delivery, station, ...rest }) => ({
      ...rest,
      cardId: +card,
      stationId: +station,
    }),
    validate: {
      card: (_, values) =>
        myCard.balance < values.amount * good.price + values.sum
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  useEffect(() => {
    form.setFieldValue('station', '');
    form.setFieldValue('sum', +form.values.delivery);
  }, [form.values.delivery]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();
  const { data: stations, ...stationsResponse } = useSelectAllStationsQuery(
    undefined,
    { skip: !+form.values.delivery },
  );

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  myCard.balance = card?.account.balance || 0;
  const maxAmount =
    card && Math.floor((card.account.balance - form.values.sum) / good.price);

  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const handleSubmit = async (dto: CreatePurchaseDto) => {
    const data = await createPurchase(dto);
    if (!('error' in data) && !hasRole) {
      if (dto.stationId && dto.sum) {
        navigate('/deliveries/my');
      } else {
        navigate('/purchases/my');
      }
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.goods')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...good.card.user} />}
        iconWidth={48}
        value={parseCard(good.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...good} />}
        iconWidth={48}
        value={parseItem(good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(good)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${good.price} ${t('constants.currency')}`}
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
          form.values.amount * good.price + form.values.sum
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
        max={customMin(good.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
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
            data={selectStations(stations)}
            limit={20}
            searchable
            required
            readOnly={stationsResponse.isFetching}
            {...form.getInputProps('station')}
          />
          <NumberInput
            label={t('columns.sum')}
            placeholder={t('columns.sum')}
            required
            min={1}
            max={customMin(
              MAX_PRICE_VALUE,
              myCard.balance - form.values.amount * good.price,
            )}
            {...form.getInputProps('sum')}
          />
        </>
      )}
    </CustomForm>
  );
}

export const buyGoodFactory = (hasRole: boolean) => ({
  open: (good: Good) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.goods'),
      children: <BuyGoodModal data={good} hasRole={hasRole} />,
    }),
  disable: (good: Good) => !good.amount,
  color: Color.GREEN,
});

export const buyMyGoodAction = buyGoodFactory(false);

export const buyUserGoodAction = buyGoodFactory(true);
