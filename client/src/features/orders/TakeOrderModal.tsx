import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useTakeOrderMutation } from '../orders/orders.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { TakeOrderDto } from '../orders/order.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Order>;

export default function TakeOrderModal({ data: order }: Props) {
  const form = useForm({
    initialValues: {
      orderId: order.id,
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const [takeOrder, { isLoading }] = useTakeOrderMutation();

  const handleSubmit = async (dto: TakeOrderDto) => {
    await takeOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Take order'}
    >
      <TextInput
        label='Customer'
        icon={<CustomAvatar {...order.lease.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...order} />}
        iconWidth={48}
        value={items[order.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={order.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(order)} disabled />
      <TextInput label='Price' value={`${order.price}$`} disabled />
      <TextInput label='Storage' value={parseCell(order.lease.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...order.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.cell.storage.card)}
        disabled
      />
      <Select
        label='Card'
        placeholder='Card'
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const takeOrderAction = {
  open: (order: Order) =>
    openModal({
      title: 'Take Order',
      children: <TakeOrderModal data={order} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
