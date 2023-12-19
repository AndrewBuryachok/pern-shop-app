import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingsItem';
import {
  parseCard,
  parseCell,
  parseKind,
  parseTime,
  viewThings,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease>;

export default function ViewLeaseModal({ data: lease }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={lease.id} disabled />
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
        label={t('columns.completed')}
        value={parseTime(lease.completedAt)}
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
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewLeaseAction = {
  open: (lease: Lease) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.lease'),
      children: <ViewLeaseModal data={lease} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
