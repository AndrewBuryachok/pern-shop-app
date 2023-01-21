import { NativeSelect, NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useCreateTradeMutation } from '../trades/trades.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateTradeDto } from '../trades/trade.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  customMin,
  parseCard,
  parseStore,
  parseThingAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Ware>;

export default function BuyWareModal({ data: ware }: Props) {
  const form = useForm({
    initialValues: {
      wareId: ware.id,
      card: '',
      amount: 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards } = useSelectMyCardsQuery();

  const card = cards?.find((card) => card.id === +form.values.card);
  const maxAmount = card && Math.floor(card.balance / ware.price);

  const [createTrade, { isLoading }] = useCreateTradeMutation();

  const handleSubmit = async (dto: CreateTradeDto) => {
    await createTrade(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Buy ware'}
    >
      <TextInput label='Seller' value={parseCard(ware.rent.card)} disabled />
      <TextInput
        label='Item'
        value={items[ware.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={ware.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(ware)} disabled />
      <TextInput label='Price' value={`${ware.price}$`} disabled />
      <TextInput label='Market' value={parseStore(ware.rent.store)} disabled />
      <NativeSelect
        label='Card'
        data={selectCardsWithBalance(cards)}
        required
        {...form.getInputProps('card')}
      />
      <NumberInput
        label='Amount'
        placeholder='Amount'
        required
        min={1}
        max={customMin(ware.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
    </CustomForm>
  );
}

export const buyWareAction = {
  open: (ware: Ware) =>
    openModal({
      title: 'Buy Ware',
      children: <BuyWareModal data={ware} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
