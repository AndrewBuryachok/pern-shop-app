import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Station } from './station.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Station>;

export default function ViewStationModal({ data: station }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={station.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...station.user} />}
        iconWidth={48}
        value={station.user.nick}
        readOnly
      />
      <TextInput label={t('columns.station')} value={station.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={station.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={station.x} readOnly />
      <TextInput label={t('columns.y')} value={station.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(station.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewStationAction = {
  open: (station: Station) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.stations'),
      children: <ViewStationModal data={station} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
