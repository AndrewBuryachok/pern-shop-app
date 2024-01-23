import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useSelectLotBidsQuery } from './lots.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lot>;

export default function ViewLotModal({ data: lot }: Props) {
  const [t] = useTranslation();

  const { data: bids, ...bidsResponse } = useSelectLotBidsQuery(lot.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={lot.id} readOnly />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={parseItem(lot.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={lot.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(lot)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${lot.price} ${t('constants.currency')}`}
        readOnly
      />
      <Select
        label={t('columns.bids')}
        placeholder={`${t('components.total')}: ${bids?.length || 0}`}
        rightSection={<RefetchAction {...bidsResponse} />}
        itemComponent={StatesItem}
        data={viewStates(bids || [])}
        limit={20}
        searchable
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(lot.lease.cell)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(lot.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(lot.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.lots'),
      children: <ViewLotModal data={lot} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
