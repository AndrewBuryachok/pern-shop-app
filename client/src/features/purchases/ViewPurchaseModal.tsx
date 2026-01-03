import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Purchase } from './purchase.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseItem,
  parsePlace,
  parsePurchaseAmount,
  parseStatus,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Purchase>;

export default function ViewPurchaseModal({ data: purchase }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={purchase.id} readOnly />
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...purchase.card.user} />}
        iconWidth={48}
        value={parseCard(purchase.card)}
        readOnly
      />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...purchase.good.card.user} />}
        iconWidth={48}
        value={parseCard(purchase.good.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...purchase.good} />}
        iconWidth={48}
        value={parseItem(purchase.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={purchase.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(purchase)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${purchase.amount * purchase.good.price} ${t(
          'constants.currency',
        )}`}
        readOnly
      />
      {purchase.delivery && (
        <>
          <TextInput
            label={t('columns.status')}
            value={parseStatus(purchase.delivery.status)}
            readOnly
          />
          <TextInput
            label={t('columns.executor')}
            icon={
              purchase.delivery.executorCard && (
                <CustomAvatar {...purchase.delivery.executorCard.user} />
              )
            }
            iconWidth={48}
            value={
              purchase.delivery.executorCard
                ? parseCard(purchase.delivery.executorCard)
                : '-'
            }
            readOnly
          />
        </>
      )}
      <TextInput
        label={t('columns.shop')}
        value={parsePlace(purchase.good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...purchase.good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(purchase.good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(purchase.createdAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={purchase.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewPurchaseAction = {
  open: (purchase: Purchase) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.purchases'),
      children: <ViewPurchaseModal data={purchase} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
