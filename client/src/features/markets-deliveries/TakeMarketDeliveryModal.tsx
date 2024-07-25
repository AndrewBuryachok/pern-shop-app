import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import { useTakeMarketDeliveryMutation } from './markets-deliveries.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeMarketDeliveryDto } from './market-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseItem,
  parseTradeAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<MarketDelivery> & { hasRole: boolean };

export default function TakeMarketDeliveryModal({
  data: marketDelivery,
  hasRole,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketDeliveryId: marketDelivery.id,
      user: '',
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [takeMarketDelivery, { isLoading }] = useTakeMarketDeliveryMutation();

  const handleSubmit = async (dto: TakeMarketDeliveryDto) => {
    await takeMarketDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...marketDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(marketDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...marketDelivery.trade.ware} />}
        iconWidth={48}
        value={parseItem(marketDelivery.trade.ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={marketDelivery.trade.ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(marketDelivery.trade)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${marketDelivery.price} ${t('constants.currency')}`}
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

export const takeMarketDeliveryFactory = (hasRole: boolean) => ({
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.deliveries'),
      children: (
        <TakeMarketDeliveryModal data={marketDelivery} hasRole={hasRole} />
      ),
    }),
  disable: (marketDelivery: MarketDelivery) =>
    marketDelivery.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyMarketDeliveryAction = takeMarketDeliveryFactory(false);

export const takeUserMarketDeliveryAction = takeMarketDeliveryFactory(true);
