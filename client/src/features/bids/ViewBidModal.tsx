import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Bid } from './bid.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Bid>;

export default function ViewBidModal({ data: bid }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={bid.id} readOnly />
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...bid.card.user} />}
        iconWidth={48}
        value={parseCard(bid.card)}
        readOnly
      />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...bid.lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(bid.lot.lease.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...bid.lot} />}
        iconWidth={48}
        value={parseItem(bid.lot.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={bid.lot.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(bid.lot)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${bid.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(bid.lot.lease.cell)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...bid.lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(bid.lot.lease.cell.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(bid.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewBidAction = {
  open: (bid: Bid) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.bids'),
      children: <ViewBidModal data={bid} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
