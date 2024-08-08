import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseDrawer,
  parseItem,
  parseStatus,
  parseStore,
  parseTime,
  parseTradeAmount,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<MarketDelivery>;

export default function ViewMarketDeliveryModal({
  data: marketDelivery,
}: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={marketDelivery.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...marketDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(marketDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...marketDelivery.trade.ware} />}
        iconWidth={48}
        value={parseItem(marketDelivery.trade.ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={marketDelivery.trade.ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(marketDelivery.trade)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${marketDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(marketDelivery.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          marketDelivery.executorCard && (
            <CustomAvatar {...marketDelivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={
          marketDelivery.executorCard
            ? parseCard(marketDelivery.executorCard)
            : '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.fromMarket')}
        value={parseStore(marketDelivery.trade.ware.rent.store)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={
          <CustomAvatar
            {...marketDelivery.trade.ware.rent.store.market.card.user}
          />
        }
        iconWidth={48}
        value={parseCard(marketDelivery.trade.ware.rent.store.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.toStation')}
        value={parseDrawer(marketDelivery.hire.drawer)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={
          <CustomAvatar {...marketDelivery.hire.drawer.station.card.user} />
        }
        iconWidth={48}
        value={parseCard(marketDelivery.hire.drawer.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(marketDelivery.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(marketDelivery.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={marketDelivery.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewMarketDeliveryAction = {
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.deliveries'),
      children: <ViewMarketDeliveryModal data={marketDelivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
