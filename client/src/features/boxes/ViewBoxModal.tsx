import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Box } from './box.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Box>;

export default function ViewBoxModal({ data: box }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={box.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...box.station.card.user} />}
        iconWidth={48}
        value={parseCard(box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parsePlace(box.station)}
        readOnly
      />
      <TextInput label={t('columns.box')} value={`#${box.name}`} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${box.station.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.reserved')}
        value={parseTime(box.reservedUntil)}
        readOnly
      />
    </Stack>
  );
}

export const viewBoxAction = {
  open: (box: Box) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.boxes'),
      children: <ViewBoxModal data={box} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
