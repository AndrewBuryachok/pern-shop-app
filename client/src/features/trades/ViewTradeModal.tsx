import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Trade } from './trade.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseItem,
  parseStore,
  parseTime,
  parseTradeAmount,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Trade>;

export default function ViewTradeModal({ data: trade }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...trade.card.user} />}
        iconWidth={48}
        value={parseCard(trade.card)}
        disabled
      />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...trade.ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...trade.ware} />}
        iconWidth={48}
        value={parseItem(trade.ware.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={trade.ware.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(trade)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${trade.amount * trade.ware.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.market')}
        value={parseStore(trade.ware.rent.store)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...trade.ware.rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.store.market.card)}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(trade.createdAt)}
        disabled
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={trade.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewTradeAction = {
  open: (trade: Trade) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.trade'),
      children: <ViewTradeModal data={trade} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
