import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseItem,
  parsePlace,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Good>;

export default function ViewGoodModal({ data: good }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={good.id} readOnly />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...good.shop.user} />}
        iconWidth={48}
        value={good.shop.user.nick}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...good} />}
        iconWidth={48}
        value={parseItem(good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.shop')}
        value={parsePlace(good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(good)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${good.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(good.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewGoodAction = {
  open: (good: Good) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.goods'),
      children: <ViewGoodModal data={good} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
