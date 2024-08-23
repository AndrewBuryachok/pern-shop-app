import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Bargain } from './bargain.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBargainAmount,
  parseCard,
  parseItem,
  parsePlace,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Bargain>;

export default function ViewBargainModal({ data: bargain }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={bargain.id} readOnly />
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...bargain.card.user} />}
        iconWidth={48}
        value={parseCard(bargain.card)}
        readOnly
      />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...bargain.good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(bargain.good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...bargain.good} />}
        iconWidth={48}
        value={parseItem(bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(bargain)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${bargain.amount * bargain.good.price} ${t(
          'constants.currency',
        )}`}
        readOnly
      />
      <TextInput
        label={t('columns.shop')}
        value={parsePlace(bargain.good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(bargain.createdAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={bargain.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewBargainAction = {
  open: (bargain: Bargain) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.bargains'),
      children: <ViewBargainModal data={bargain} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
