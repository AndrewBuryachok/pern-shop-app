import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Transaction>;

export default function ViewTransactionModal({ data: transaction }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={transaction.id} readOnly />
      <TextInput
        label={t('columns.sender')}
        icon={
          <CustomAvatar
            {...(transaction.senderCard?.user || transaction.executorUser!)}
          />
        }
        iconWidth={48}
        value={
          transaction.senderCard
            ? parseCard(transaction.senderCard)
            : transaction.executorUser!.nick
        }
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={
          <CustomAvatar
            {...(transaction.receiverCard?.user || transaction.executorUser!)}
          />
        }
        iconWidth={48}
        value={
          transaction.receiverCard
            ? parseCard(transaction.receiverCard)
            : transaction.executorUser!.nick
        }
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${transaction.sum} ${t('constants.currency')}`}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={transaction.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(transaction.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewTransactionAction = {
  open: (transaction: Transaction) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.transactions'),
      children: <ViewTransactionModal data={transaction} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
