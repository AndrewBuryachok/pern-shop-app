import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useCreateBidMutation } from '../bids/bids.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateBidDto } from '../bids/bid.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  parseCard,
  parseCell,
  parseThingAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, items, MAX_SUM_VALUE } from '../../common/constants';

type Props = IModal<Lot>;

export default function BuyLotModal({ data: lot }: Props) {
  const form = useForm({
    initialValues: {
      lotId: lot.id,
      card: '',
      price: 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const card = cards?.find((card) => card.id === +form.values.card);
  const maxPrice = card && Math.floor(card.balance / lot.price);

  const [createBid, { isLoading }] = useCreateBidMutation();

  const handleSubmit = async (dto: CreateBidDto) => {
    await createBid(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Buy lot'}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={items[lot.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={lot.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(lot)} disabled />
      <TextInput label='Price' value={`${lot.price}$`} disabled />
      <TextInput label='Storage' value={parseCell(lot.lease.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
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
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, maxPrice)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const buyLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: 'Buy Lot',
      children: <BuyLotModal data={lot} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
