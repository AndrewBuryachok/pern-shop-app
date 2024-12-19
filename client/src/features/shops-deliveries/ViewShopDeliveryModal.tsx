import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBargainAmount,
  parseBox,
  parseCard,
  parseItem,
  parsePlace,
  parseStatus,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<ShopDelivery>;

export default function ViewShopDeliveryModal({ data: shopDelivery }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={shopDelivery.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...shopDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...shopDelivery.bargain.good} />}
        iconWidth={48}
        value={parseItem(shopDelivery.bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={shopDelivery.bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(shopDelivery.bargain)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${shopDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(shopDelivery.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          shopDelivery.executorCard && (
            <CustomAvatar {...shopDelivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={
          shopDelivery.executorCard ? parseCard(shopDelivery.executorCard) : '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.fromShop')}
        value={parsePlace(shopDelivery.bargain.good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shopDelivery.bargain.good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.bargain.good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.toStation')}
        value={parseBox(shopDelivery.hire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shopDelivery.hire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.hire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(shopDelivery.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(shopDelivery.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={shopDelivery.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewShopDeliveryAction = {
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.deliveries'),
      children: <ViewShopDeliveryModal data={shopDelivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
