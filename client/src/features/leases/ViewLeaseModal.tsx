import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import { useSelectLeaseThingsQuery } from './leases.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseCell, parseKind, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease>;

export default function ViewLeaseModal({ data: lease }: Props) {
  const [t] = useTranslation();

  const { data: things, ...thingsResponse } = useSelectLeaseThingsQuery(
    lease.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={lease.id} readOnly />
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...lease.card.user} />}
        iconWidth={48}
        value={parseCard(lease.card)}
        readOnly
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
      <TextInput
        label={t('columns.kind')}
        value={parseKind(lease.kind)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(lease.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(lease.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewLeaseAction = {
  open: (lease: Lease) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.leases'),
      children: <ViewLeaseModal data={lease} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
