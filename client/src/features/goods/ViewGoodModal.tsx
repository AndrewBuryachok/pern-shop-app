import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useSelectGoodStatesQuery } from './goods.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseItem,
  parsePlace,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Good>;

export default function ViewGoodModal({ data: good }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectGoodStatesQuery(good.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={good.id} readOnly />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...good.card.user} />}
        iconWidth={48}
        value={parseCard(good.card)}
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
        label={t('columns.stock')}
        value={parseThingAmount(good)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${good.price} ${t('constants.currency')}`}
        readOnly
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${states?.length || 0}`}
        rightSection={<RefetchAction {...statesResponse} />}
        itemComponent={StatesItem}
        data={viewStates(states || [])}
        limit={20}
        searchable
      />
      <TextInput
        label={t('columns.shop')}
        value={parsePlace(good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(good.shop.card)}
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
