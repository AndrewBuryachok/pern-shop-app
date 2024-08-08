import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateDrawerMutation } from './drawers.api';
import {
  useSelectAllStationsQuery,
  useSelectMyStationsQuery,
} from '../stations/stations.api';
import { CreateDrawerDto } from './drawer.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectStations } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateDrawerModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      station: '',
      name: '',
    },
    transformValues: ({ station }) => ({ stationId: +station }),
  });

  const { data: stations, ...stationsResponse } = hasRole
    ? useSelectAllStationsQuery()
    : useSelectMyStationsQuery();

  const station = stations?.find(
    (station) => station.id === +form.values.station,
  );

  useEffect(
    () => form.setFieldValue('name', station ? `#${station.drawers + 1}` : ''),
    [form.values.station],
  );

  const [createDrawer, { isLoading }] = useCreateDrawerMutation();

  const handleSubmit = async (dto: CreateDrawerDto) => {
    await createDrawer(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.drawers')}
    >
      <Select
        label={t('columns.station')}
        placeholder={t('columns.station')}
        rightSection={<RefetchAction {...stationsResponse} />}
        itemComponent={PlacesItem}
        data={selectStations(stations)}
        limit={20}
        searchable
        required
        readOnly={stationsResponse.isFetching}
        {...form.getInputProps('station')}
      />
      <TextInput
        label={t('columns.name')}
        readOnly
        {...form.getInputProps('name')}
      />
    </CustomForm>
  );
}

export const createDrawerFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.drawers'),
      children: <CreateDrawerModal hasRole={hasRole} />,
    }),
});

export const createMyDrawerButton = createDrawerFactory(false);

export const createUserDrawerButton = createDrawerFactory(true);
