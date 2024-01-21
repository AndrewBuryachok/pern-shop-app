import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import { useCompleteLeaseMutation } from './leases.api';
import { LeaseIdDto } from './lease.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseCell } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease>;

export default function CompleteLeaseModal({ data: lease }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      leaseId: lease.id,
    },
  });

  const [completeLease, { isLoading }] = useCompleteLeaseMutation();

  const handleSubmit = async (dto: LeaseIdDto) => {
    await completeLease(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.leases')}
    >
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...lease.card.user} />}
        iconWidth={48}
        value={parseCard(lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(lease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${lease.cell.storage.price} ${t('constants.currency')}`}
        disabled
      />
    </CustomForm>
  );
}

export const completeLeaseAction = {
  open: (lease: Lease) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.leases'),
      children: <CompleteLeaseModal data={lease} />,
    }),
  disable: (lease: Lease) => lease.completedAt > new Date(),
  color: Color.RED,
};
