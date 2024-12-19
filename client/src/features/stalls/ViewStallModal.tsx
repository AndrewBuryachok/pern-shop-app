import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Stall } from './stall.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Stall>;

export default function ViewStallModal({ data: stall }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={stall.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...stall.market.card.user} />}
        iconWidth={48}
        value={parseCard(stall.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.market')}
        value={parsePlace(stall.market)}
        readOnly
      />
      <TextInput label={t('columns.stall')} value={`#${stall.name}`} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${stall.marketTag.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.reserved')}
        value={parseTime(stall.reservedUntil)}
        readOnly
      />
    </Stack>
  );
}

export const viewStallAction = {
  open: (stall: Stall) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.stalls'),
      children: <ViewStallModal data={stall} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
