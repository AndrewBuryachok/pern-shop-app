import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace } from './place.model';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItem } from '../../common/components/ThingItem';

type Props = IModal<ExtPlace>;

export default function PlaceModal({ data: place }: Props) {
  const label = ['Users', 'Goods', 'Stores', 'Cells'][place.type];
  const component =
    label === 'Users' ? UsersItem : label === 'Goods' ? ThingsItem : undefined;

  return (
    <Stack spacing={8}>
      <TextInput label='Owner' value={place.owner} disabled />
      <TextInput label='Name' value={place.name} disabled />
      <TextInput label='X' value={place.x} disabled />
      <TextInput label='Y' value={place.y} disabled />
      {place.price && <TextInput label='Price' value={place.price} disabled />}
      <Select
        label={label}
        placeholder={label}
        itemComponent={component}
        data={place.data}
        searchable
      />
    </Stack>
  );
}

export const openPlaceModal = (place: ExtPlace) =>
  openModal({
    title: `View ${['City', 'Shop', 'Market', 'Storage'][place.type]}`,
    children: <PlaceModal data={place} />,
  });
