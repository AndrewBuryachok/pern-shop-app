import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Drawer } from './drawer.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Drawer>;

export default function ViewDrawerModal({ data: drawer }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={drawer.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...drawer.station.card.user} />}
        iconWidth={48}
        value={parseCard(drawer.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parsePlace(drawer.station)}
        readOnly
      />
      <TextInput
        label={t('columns.drawer')}
        value={`#${drawer.name}`}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${drawer.station.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.reserved')}
        value={parseTime(drawer.reservedUntil)}
        readOnly
      />
    </Stack>
  );
}

export const viewDrawerAction = {
  open: (drawer: Drawer) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.drawers'),
      children: <ViewDrawerModal data={drawer} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
