import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { useCompleteInvoiceMutation } from './invoices.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CompleteInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { CardsItem } from '../../common/components/CardsItem';
import { parseCard, selectCardsWithBalance } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Invoice> & { hasRole: boolean };

export default function CompleteInvoiceModal({
  data: invoice,
  hasRole,
}: Props) {
  const [t] = useTranslation();

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
      card: () =>
        myCard.balance < invoice.sum ? t('errors.not_enough_balance') : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(invoice.receiverUser.id)
    : useSelectMyCardsQuery();

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
      text={t('actions.complete') + ' ' + t('modals.invoice')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...invoice.senderCard.user} />}
        iconWidth={48}
        value={parseCard(invoice.senderCard)}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...invoice.receiverUser} />}
        iconWidth={48}
        value={invoice.receiverUser.nick}
        disabled
      />
      <TextInput label={t('columns.sum')} value={`${invoice.sum}$`} disabled />
      <Textarea
        label={t('columns.description')}
        value={invoice.description}
        disabled
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
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

export const completeInvoiceFactory = (hasRole: boolean) => ({
  open: (invoice: Invoice) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.invoice'),
      children: <CompleteInvoiceModal data={invoice} hasRole={hasRole} />,
    }),
  disable: (invoice: Invoice) => !!invoice.completedAt,
  color: Color.GREEN,
});

export const completeMyInvoiceAction = completeInvoiceFactory(false);

export const completeUserInvoiceAction = completeInvoiceFactory(true);
