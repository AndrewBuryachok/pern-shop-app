import { Loader, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { useCompleteInvoiceMutation } from './invoices.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CompleteInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseDate,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Invoice>;

export default function CompleteInvoiceModal({ data: invoice }: Props) {
  const created = parseDate(invoice.createdAt);

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      invoiceId: invoice.id,
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({
      ...rest,
      cardId: +card,
    }),
    validate: {
      card: () => (myCard.balance < invoice.sum ? 'Not enough balance' : null),
    },
  });

  const { data: cards, isFetching: isCardsFetching } = useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createInvoice, { isLoading }] = useCompleteInvoiceMutation();

  const handleSubmit = async (dto: CompleteInvoiceDto) => {
    await createInvoice(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Complete invoice'}
    >
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...invoice.senderCard.user} />}
        iconWidth={48}
        value={parseCard(invoice.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...invoice.receiverUser} />}
        iconWidth={48}
        value={invoice.receiverUser.name}
        disabled
      />
      <TextInput label='Sum' value={`${invoice.sum}$`} disabled />
      <Textarea label='Description' value={invoice.description} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
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

export const completeInvoiceAction = {
  open: (invoice: Invoice) =>
    openModal({
      title: 'Complete Invoice',
      children: <CompleteInvoiceModal data={invoice} />,
    }),
  disable: (invoice: Invoice) => {
    const user = getCurrentUser()!;
    return !!invoice.completedAt || invoice.receiverUser.id !== user.id;
  },
  color: Color.GREEN,
};
