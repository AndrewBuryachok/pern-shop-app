import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useTakeDeliveryMutation } from './deliveries.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeDeliveryDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseBargainAmount,
  parseCard,
  parseItem,
  parseSaleAmount,
  parseTradeAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Delivery> & { hasRole: boolean };

export default function TakeDeliveryModal({ data: delivery, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      user: '',
      card: '',
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [takeDelivery, { isLoading }] = useTakeDeliveryMutation();

  const handleSubmit = async (dto: TakeDeliveryDto) => {
    await takeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.hire.card)}
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.bargain.good} />}
          iconWidth={48}
          value={parseItem(delivery.bargain.good.item)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.trade.ware} />}
          iconWidth={48}
          value={parseItem(delivery.trade.ware.item)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.sale.product} />}
          iconWidth={48}
          value={parseItem(delivery.sale.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          delivery.bargain?.good.description ||
          delivery.trade?.ware.description ||
          delivery.sale?.product.description ||
          '-'
        }
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.amount')}
          value={parseBargainAmount(delivery.bargain)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.amount')}
          value={parseTradeAmount(delivery.trade)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.amount')}
          value={parseSaleAmount(delivery.sale)}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price} ${t('constants.currency')}`}
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
    </CustomForm>
  );
}

export const takeDeliveryFactory = (hasRole: boolean) => ({
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.deliveries'),
      children: <TakeDeliveryModal data={delivery} hasRole={hasRole} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyDeliveryAction = takeDeliveryFactory(false);

export const takeUserDeliveryAction = takeDeliveryFactory(true);
