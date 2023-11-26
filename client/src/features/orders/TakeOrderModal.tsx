import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useTakeOrderMutation } from './orders.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Order> & { hasRole: boolean };

export default function TakeOrderModal({ data: order, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      orderId: order.id,
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

  const [takeOrder, { isLoading }] = useTakeOrderMutation();

  const handleSubmit = async (dto: TakeOrderDto) => {
    await takeOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.order')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...order.lease.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...order} />}
        iconWidth={48}
        value={parseItem(order.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={order.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(order)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${order.price}$`}
        disabled
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
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const takeOrderFactory = (hasRole: boolean) => ({
  open: (order: Order) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.order'),
      children: <TakeOrderModal data={order} hasRole={hasRole} />,
    }),
  disable: (order: Order) => order.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyOrderAction = takeOrderFactory(false);

export const takeUserOrderAction = takeOrderFactory(true);
