import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useCreateSaleMutation } from '../sales/sales.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { useSelectFreeStationsQuery } from '../stations/stations.api';
import { CreateSaleDto } from '../sales/sale.dto';
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
  selectHaulages,
  selectStationsWithPrice,
  selectUsers,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Product> & { hasRole: boolean };

export default function BuyProductModal({ data: product, hasRole }: Props) {
  const [t] = useTranslation();

  const station = { price: 0 };

  const form = useForm({
    initialValues: {
      productId: product.id,
      user: '',
      card: '',
      amount: 1,
      haulage: '0',
      station: '',
      price: 0,
    },
    transformValues: ({ card, station, ...rest }) => ({
      ...rest,
      cardId: +card,
      stationId: +station,
    }),
  });

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
    { skip: !+form.values.haulage },
  );

  useEffect(() => {
    form.setFieldValue('station', '');
    form.setFieldValue('price', +form.values.haulage);
  }, [form.values.haulage]);

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  const maxAmount =
    card &&
    Math.floor(
      (card.balance - station.price - form.values.price) / product.price,
    );
  station.price =
    stations?.find((station) => station.id === +form.values.station)?.price ||
    0;

  const [createSale, { isLoading }] = useCreateSaleMutation();

  const handleSubmit = async (dto: CreateSaleDto) => {
    await createSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.products')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={parseItem(product.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={product.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(product)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${product.price} ${t('constants.currency')}`}
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
        rightSection={<RefetchAction {...cardsResponse} />}
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
        max={customMin(product.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
      <Select
        label={t('columns.haulage')}
        placeholder={t('columns.haulage')}
        data={selectHaulages()}
        searchable
        required
        {...form.getInputProps('haulage')}
      />
      {!!+form.values.haulage && (
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
                form.values.amount * product.price -
                station.price,
            )}
            {...form.getInputProps('price')}
          />
        </>
      )}
    </CustomForm>
  );
}

export const buyProductFactory = (hasRole: boolean) => ({
  open: (product: Product) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.products'),
      children: <BuyProductModal data={product} hasRole={hasRole} />,
    }),
  disable: (product: Product) => !product.amount || !!product.completedAt,
  color: Color.GREEN,
});

export const buyMyProductAction = buyProductFactory(false);

export const buyUserProductAction = buyProductFactory(true);
