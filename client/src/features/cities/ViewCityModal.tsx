import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function ViewCityModal({ data: city }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...city.user} />}
        iconWidth={48}
        value={city.user.name}
        disabled
      />
      <TextInput label='City' value={city.name} disabled />
      <TextInput label='X' value={city.x} disabled />
      <TextInput label='Y' value={city.y} disabled />
      <Select
        label='Users'
        placeholder={`Total: ${city.users.length}`}
        itemComponent={UsersItem}
        data={viewUsers(city.users)}
        searchable
      />
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
