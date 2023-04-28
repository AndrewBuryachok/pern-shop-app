import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useCreateSaleMutation } from '../sales/sales.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateSaleDto } from '../sales/sale.dto';
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
import { Color, items } from '../../common/constants';

type Props = IModal<Product>;

export default function BuyProductModal({ data: product }: Props) {
  const form = useForm({
    initialValues: {
      productId: product.id,
      card: '',
      amount: 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const card = cards?.find((card) => card.id === +form.values.card);
  const maxAmount = card && Math.floor(card.balance / product.price);

  const [createSale, { isLoading }] = useCreateSaleMutation();

  const handleSubmit = async (dto: CreateSaleDto) => {
    await createSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Buy product'}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={items[product.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={product.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(product)} disabled />
      <TextInput label='Price' value={`${product.price}$`} disabled />
      <TextInput
        label='Storage'
        value={parseCell(product.lease.cell)}
        disabled
      />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...product.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.cell.storage.card)}
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
        label='Amount'
        placeholder='Amount'
        required
        min={1}
        max={customMin(product.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
    </CustomForm>
  );
}

export const buyProductAction = {
  open: (product: Product) =>
    openModal({
      title: 'Buy Product',
      children: <BuyProductModal data={product} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
