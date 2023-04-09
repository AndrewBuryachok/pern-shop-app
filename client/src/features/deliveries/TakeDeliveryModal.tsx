import { Loader, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useTakeDeliveryMutation } from '../deliveries/deliveries.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { TakeDeliveryDto } from '../deliveries/delivery.dto';
import CustomForm from '../../common/components/CustomForm';
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

type Props = IModal<Delivery>;

export default function TakeDeliveryModal({ data: delivery }: Props) {
  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, isFetching: isCardsFetching } = useSelectMyCardsQuery();

  const [takeDelivery, { isLoading }] = useTakeDeliveryMutation();

  const handleSubmit = async (dto: TakeDeliveryDto) => {
    await takeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Take delivery'}
    >
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...delivery.senderCard.user} />}
        iconWidth={48}
        value={parseCard(delivery.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...delivery.receiverUser} />}
        iconWidth={48}
        value={delivery.receiverUser.name}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...delivery} />}
        iconWidth={48}
        value={items[delivery.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={delivery.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(delivery)} disabled />
      <TextInput label='Price' value={`${delivery.price}$`} disabled />
      <TextInput
        label='From Storage'
        value={parseCell(delivery.fromCell)}
        disabled
      />
      <TextInput
        label='From Owner'
        icon={<CustomAvatar {...delivery.fromCell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromCell.storage.card)}
        disabled
      />
      <TextInput
        label='To Storage'
        value={parseCell(delivery.toCell)}
        disabled
      />
      <TextInput
        label='To Owner'
        icon={<CustomAvatar {...delivery.toCell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.toCell.storage.card)}
        disabled
      />
      <Select
        label='Card'
        placeholder='Card'
        rightSection={isCardsFetching && <Loader size={16} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={isCardsFetching}
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const takeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: 'Take Delivery',
      children: <TakeDeliveryModal data={delivery} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
