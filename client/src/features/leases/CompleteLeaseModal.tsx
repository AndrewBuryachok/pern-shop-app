import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import { useCompleteLeaseMutation } from './leases.api';
import { CompleteLeaseDto } from './lease.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingItem';
import {
  parseCard,
  parseCell,
  parseKind,
  parseTime,
  viewThings,
} from '../../common/utils';
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

  const handleSubmit = async (dto: CompleteLeaseDto) => {
    await completeLease(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.lease')}
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
        value={`${lease.cell.storage.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(lease.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.kind')}
        value={parseKind(lease.kind)}
        disabled
      />
      <Select
        label={t('columns.things')}
        placeholder={`${t('components.total')}: ${[lease.thing].length}`}
        itemComponent={ThingsItem}
        data={viewThings([lease.thing])}
        searchable
      />
    </CustomForm>
  );
}

export const completeLeaseAction = {
  open: (lease: Lease) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.lease'),
      children: <CompleteLeaseModal data={lease} />,
    }),
  disable: (lease: Lease) => !!lease.completedAt,
  color: Color.GREEN,
};
