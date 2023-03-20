import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Store } from './store.model';
import { useCreateRentMutation } from '../rents/rents.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateRentDto } from '../rents/rent.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import {
  parseCard,
  parseStore,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Store>;

export default function ReserveStoreModal({ data: store }: Props) {
  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      storeId: store.id,
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
    validate: {
      card: () =>
        myCard.balance < store.market.price ? 'Not enough balance' : null,
    },
  });

  const { data: cards } = useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

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
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...store.market.card.user} />}
        iconWidth={48}
        value={parseCard(store.market.card)}
        disabled
      />
      <TextInput label='Store' value={parseStore(store)} disabled />
      <TextInput label='Price' value={`${store.market.price}$`} disabled />
      <Select
        label='Card'
        placeholder='Card'
        data={selectCardsWithBalance(cards)}
        searchable
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
  disable: () => false,
  color: Color.GREEN,
};
