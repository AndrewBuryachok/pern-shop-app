import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import { useContinueLeaseMutation } from './leases.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { LeaseIdDto } from './lease.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseCell,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease> & { hasRole: boolean };

export default function ContinueLeaseModal({ data: lease, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      leaseId: lease.id,
      card: `${lease.card.id}`,
    },
    validate: {
      card: () =>
        myCard.balance < lease.cell.storage.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(lease.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [continueLease, { isLoading }] = useContinueLeaseMutation();

  const handleSubmit = async (dto: LeaseIdDto) => {
    await continueLease(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.continue') + ' ' + t('modals.leases')}
    >
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...lease.card.user} />}
        iconWidth={48}
        value={parseCard(lease.card)}
        readOnly
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
        readOnly
        {...form.getInputProps('card')}
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lease.cell.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(lease.cell)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${lease.cell.storage.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const continueLeaseFactory = (hasRole: boolean) => ({
  open: (lease: Lease) =>
    openModal({
      title: t('actions.continue') + ' ' + t('modals.leases'),
      children: <ContinueLeaseModal data={lease} hasRole={hasRole} />,
    }),
  disable: (lease: Lease) => lease.completedAt > new Date(),
  color: Color.GREEN,
});

export const continueMyLeaseAction = continueLeaseFactory(false);

export const continueUserLeaseAction = continueLeaseFactory(true);
