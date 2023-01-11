import { NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Store } from './store.model';
import { useCreateRentMutation } from '../rents/rents.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateRentDto } from '../rents/rent.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  parseCard,
  parseStore,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Store>;

export default function ReserveStoreModal({ data: store }: Props) {
  const form = useForm({
    initialValues: {
      storeId: store.id,
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards } = useSelectMyCardsQuery();

  const card = cards?.find((card) => card.id === +form.values.card);
  card &&
    (card.balance < store.market.price
      ? form.setFieldError('card', 'Not enough balance')
      : form.clearFieldError('card'));

  const [createRent, { isLoading }] = useCreateRentMutation();

  const handleSubmit = async (dto: CreateRentDto) => {
    await createRent(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Reserve store'}
    >
      <TextInput label='Owner' value={parseCard(store.market.card)} disabled />
      <TextInput label='Store' value={parseStore(store)} disabled />
      <TextInput label='Price' value={`${store.market.price}$`} disabled />
      <NativeSelect
        label='Card'
        data={selectCardsWithBalance(cards)}
        required
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const reserveStoreAction = {
  open: (store: Store) =>
    openModal({
      title: 'Reserve Store',
      children: <ReserveStoreModal data={store} />,
    }),
  disable: (store: Store) => !!store.reservedAt,
  color: Color.GREEN,
};
