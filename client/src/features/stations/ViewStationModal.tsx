import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Station } from './station.model';
import { useSelectStationStatesQuery } from './stations.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { StatesItem } from '../../common/components/StatesItem';
import { parseCard, parseTime, viewStates } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Station>;

export default function ViewStationModal({ data: station }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectStationStatesQuery(
    station.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={station.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...station.card.user} />}
        iconWidth={48}
        value={parseCard(station.card)}
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
        label={t('columns.price')}
        value={`${station.price} ${t('constants.currency')}`}
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
