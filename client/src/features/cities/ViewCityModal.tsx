import { NativeSelect, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function ViewCityModal({ data: city }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput label='Owner' value={city.user.name} disabled />
      <TextInput label='City' value={city.name} disabled />
      <TextInput label='X' value={city.x} disabled />
      <TextInput label='Y' value={city.y} disabled />
      <NativeSelect label='Citizens' data={viewUsers(city.users)} />
    </Stack>
  );
}

export const viewCityAction = {
  open: (city: City) =>
    openModal({
      title: 'View City',
      children: <ViewCityModal data={city} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
